module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onBlur, onFocus)
import Dict exposing (Dict)
import Html.Events.Extra.Mouse as Mouse
import Regex

import Vec2 exposing (Vec2)

main = Browser.sandbox { init = init, update = update, view = view }

-- MODEL

type alias Model =
  { nodes : Nodes
  , result : Maybe NodeId

  , search : Maybe String
  , dragMode : Maybe DragMode
  }

init : Model
init =
  { nodes = { values = Dict.empty, nextId = 0 }
  , result = Nothing
  , dragMode = Nothing
  , search = Nothing
  }

type DragMode
  = MoveNodeDrag { node : NodeId, mouse : Vec2 }
  | PrototypeConnectionDrag { supplier : NodeId, openEnd : Vec2 }

type alias NodeId = Int

type alias Nodes = 
  { values : Dict NodeId NodeView
  , nextId : NodeId 
  }

type alias NodeView =
  { position : Vec2
  , node : Node
  }

type Node
  = Whitespace
  | CharSet String
  | Optional (Maybe NodeId)
  | Set (List NodeId)
  | Flags { expression : Maybe NodeId, flags : RegexFlags }
  | Repeated { expression : Maybe NodeId, count : Int  }
  | IfFollowedBy { expression : Maybe NodeId, successor : Maybe NodeId }

type alias Prototype =
  { name : String
  , node : Node
  }

prototypes : List Prototype
prototypes = 
  [ Prototype typeNames.whitespace    Whitespace
  , Prototype typeNames.charset       (CharSet ",.?!:")
  , Prototype typeNames.optional      (Optional Nothing)
  , Prototype typeNames.set           (Set [])
  , Prototype typeNames.flags         (Flags { expression = Nothing, flags = defaultFlags })
  , Prototype typeNames.repeated      (Repeated { expression = Nothing, count = 3 })
  , Prototype typeNames.ifFollowedBy  (IfFollowedBy { expression = Nothing, successor = Nothing })
  ]

typeNames = 
  { whitespace = "Whitespace Char"
  , charset = "Char Set"
  , optional = "Optional"
  , set = "Any Of"
  , flags = "Flagged Expression"
  , repeated = "Repeated"
  , ifFollowedBy = "If Followed By"
  }

type alias RegexFlags =
  { multiple : Bool
  , caseSensitive : Bool
  , multiline : Bool
  }





buildNodeExpression : Nodes -> Node -> String
buildNodeExpression nodes node = 
  let build = buildExpression nodes in 
  case node of
    Whitespace -> "\\w"
    CharSet chars -> "[" ++ chars ++ "]"
    Optional maybeInput -> (build maybeInput) ++ "?"
    Set options -> List.map (\option -> build (Just option)) options |> String.join "|" 
    Flags { expression } -> build expression -- we use flags directly at topmost level
    Repeated { expression, count } -> (build expression) ++ "{" ++ (String.fromInt count) ++ "}"
    IfFollowedBy { expression, successor } -> (build expression) ++ "(?=" ++ (build successor) ++ ")"


{-| Dereferences a node and returns `buildExpression` of it, handling corner cases -}
buildExpression : Nodes -> Maybe NodeId -> String
buildExpression nodes nodeId = case nodeId of
  Nothing -> "(nothing)"
  Just id -> Maybe.map .node (Dict.get id nodes.values)
    |> Maybe.map (buildNodeExpression nodes) 
    |> Maybe.withDefault "(INTERNAL ERROR)"

addNode : Nodes -> NodeView -> Nodes
addNode nodes node = 
  { values = Dict.insert nodes.nextId node nodes.values
  , nextId = nodes.nextId + 1
  }

updateNode : Nodes -> NodeId -> Node -> Nodes
updateNode nodes id node = 
  let updateNodeContents nodeview = Maybe.map (\n -> { n | node = node }) nodeview
  in { nodes | values = Dict.update id updateNodeContents nodes.values }


moveNode : Nodes -> NodeId -> Vec2 -> Nodes
moveNode nodes nodeId movement = 
  let updateNodePosition node = Maybe.map (\n -> { n | position = Vec2.add n.position movement }) node
  in { nodes | values = Dict.update nodeId updateNodePosition nodes.values }


type alias RegexBuild =
  { expression: String
  , flags: RegexFlags
  }


buildRegex : Nodes -> NodeId -> RegexBuild
buildRegex nodes id =
  let
    expression = buildExpression nodes (Just id)
    nodeView = Dict.get id nodes.values
    options = case Maybe.map .node nodeView of
      Just (Flags { flags }) -> flags
      _ -> defaultFlags

  in RegexBuild expression options


constructRegexLiteral : RegexBuild -> String
constructRegexLiteral regex =
  "/" ++ regex.expression ++ "/"
     ++ (if regex.flags.multiple then "g" else "")
     ++ (if regex.flags.caseSensitive then "" else "i")
     ++ (if regex.flags.multiline then "m" else "")

compileRegex : RegexBuild -> Regex.Regex 
compileRegex build = 
  let options = { caseInsensitive = not build.flags.caseSensitive, multiline = build.flags.multiline }
  in Regex.fromStringWith options build.expression |> Maybe.withDefault Regex.never


defaultFlags = RegexFlags True True True


prependListIf: List a -> a -> Bool -> List a
prependListIf list element condition =
    if condition then element :: list
    else list

prependStringIf: String -> String -> Bool -> String
prependStringIf existing conditional condition =
    if condition then conditional ++ existing
    else existing



-- UPDATE

type Message
  = SearchMessage SearchMessage
  | DragModeMessage DragModeMessage
  | UpdateNodeMessage NodeId Node

type SearchMessage
  = UpdateSearch String
  | FinishSearch (Maybe NodeView)

type DragModeMessage
  = StartNodeMove { node : NodeId, mouse : Vec2 }
  | StartPrototypeConnect { supplier : NodeId, mouse : Vec2 }
  | UpdateDrag { newMouse : Vec2 }
--| DragEntered { node : NodeId, property : Int } TODO??ß
  | FinishDrag


update : Message -> Model -> Model
update message model =
  case message of
    UpdateNodeMessage id value ->
      { model | nodes = updateNode model.nodes id value }

    SearchMessage searchMessage ->
      case searchMessage of
        UpdateSearch query -> { model | search = Just query }
        FinishSearch result -> case result of 
          Just prototype -> { model | nodes = addNode model.nodes prototype, search = Nothing }
          Nothing -> { model | search = Nothing }

    DragModeMessage modeMessage ->
      case modeMessage of
        StartNodeMove { node, mouse } ->
          { model | dragMode = Just (MoveNodeDrag { node = node, mouse = mouse })

          -- set result node if the node type is 'Flags'
          , result = case Dict.get node model.nodes.values |> Maybe.map .node of
               Just (Flags _) -> Just node
               _ -> model.result
          }

        StartPrototypeConnect { supplier, mouse } ->
          { model | dragMode = Just (PrototypeConnectionDrag { supplier = supplier, openEnd = mouse }) }

        UpdateDrag { newMouse } ->
          case model.dragMode of 
            Just (MoveNodeDrag { node, mouse }) -> 
              let delta = Vec2.sub newMouse mouse in 
              { model | 
                nodes = moveNode model.nodes node delta
              , dragMode = Just (MoveNodeDrag { node = node, mouse = newMouse })
              }

            Just (PrototypeConnectionDrag { supplier, openEnd }) ->
              let mode = PrototypeConnectionDrag { supplier = supplier, openEnd = openEnd } in
              { model | dragMode = Just mode }

            Nothing -> model

        FinishDrag ->
          { model | dragMode = Nothing }




-- VIEW

view : Model -> Html Message
view model =
  let
    expressionResult = Maybe.map
      (\id -> buildRegex model.nodes id |> constructRegexLiteral)
      model.result

  in div
    [ Mouse.onMove (\event -> DragModeMessage (UpdateDrag { newMouse = Vec2.fromTuple event.clientPos }))
    , Mouse.onUp (\_ -> DragModeMessage FinishDrag)
    , Mouse.onLeave (\_ -> DragModeMessage FinishDrag)
    , id "main"
    ]

    [ div [ id "node-graph" ]
      [ div [ id "transform-wrapper" ]
        (List.map viewNode (Dict.toList model.nodes.values))
      ]

    , div [ id "connection-graph" ]
      [ div [ id "transform-wrapper" ]
        [] -- TODO (List.map viewConnection (Dict.toList model.nodes.values))
      ]

    , div [ id "overlay" ]
      [ nav
        [ ]
        [ text "Regex Nodes"

        , div [ id "search" ]
          [ viewSearchBar model.search
          , viewSearchResults model.search
          ]
        ]

        , div [ id "expression-result" ]
        [
          code []
          (viewExpressionResult expressionResult)
        ]
      ]
    ]


viewExpressionResult literal = case literal of
  Just result -> [ text ("const regex = " ++ result) ]
  Nothing -> []

viewSearchResults search =
  div [] (Maybe.withDefault [] (Maybe.map viewSearch search) )

viewSearchBar search = input
  [ class "search"
  , placeholder "Add Nodes"
  , value (Maybe.withDefault "" search)
  , onFocus (SearchMessage (UpdateSearch ""))
  , onInput (\text -> SearchMessage (UpdateSearch text))
  , onBlur (SearchMessage (FinishSearch Nothing))
  ] []



viewSearch : String -> List (Html Message)
viewSearch query =
  let 
    regex = Maybe.withDefault Regex.never (Regex.fromString query)
    test name = (String.isEmpty query) || (Regex.contains regex name)
    filter prototype = test prototype.name
    position = Vec2 (400) (300)
    render prototype = div 
      ( [ Mouse.onWithOptions
        "mousedown"
        { stopPropagation = False, preventDefault = False } -- do not prevent blurring the textbox on selecting a result
        (\_ -> SearchMessage (FinishSearch (Just (NodeView position prototype.node))))
      --, buttonCursor
      ] ) -- [ Mouse.onDown (\_ -> SearchMessage (FinishSearch (Just (NodeView position prototype)))) ] -- TODO do not prevent default, unfocusing the textbox
      [ text prototype.name ]
  in prototypes |> List.filter filter |> List.map render



viewNode : (NodeId, NodeView) -> Html Message
viewNode (nodeId, node) =
  div
    (  Mouse.onDown (\event -> DragModeMessage (StartNodeMove { node = nodeId, mouse = Vec2.fromTuple event.clientPos }))
    :: (class "graph-node") :: (style "width" "200px") :: [translateHTML node.position] --unpositioned
    ) 

    (case node.node of
      Whitespace -> viewWhitespaceProperties
      CharSet chars -> viewCharSetProperties chars
      Optional option -> viewOptionalProperties option
      Set options -> viewSetProperties options
      Flags flags -> viewFlagsProperties flags
      _ -> [ viewProperty "Unimplemented" NoInput False ]
    )


viewWhitespaceProperties : List (Html Message)
viewWhitespaceProperties = [ viewProperty typeNames.whitespace NoInput  True]

viewCharSetProperties : String -> List (Html Message)
viewCharSetProperties chars = [ viewProperty typeNames.charset (Characters chars) True ]

viewOptionalProperties : Maybe NodeId -> List (Html Message)
viewOptionalProperties option = [ viewProperty typeNames.optional (Connected option) True ]

viewSetProperties : List NodeId -> List (Html Message)
viewSetProperties options = 
  [ viewProperty typeNames.set NoInput True ]
  ++ viewAutoListProperties "Option" options

viewFlagsProperties : { expression : Maybe NodeId, flags : RegexFlags } -> List (Html Message)
viewFlagsProperties options = 
  [ viewProperty typeNames.flags  (Connected options.expression) False
  , viewProperty "Multiple Matches"  (Boolean options.flags.multiple) False
  , viewProperty "Case Sensitive"  (Boolean options.flags.caseSensitive) False
  , viewProperty 
    "Multiline Matches"
    (Boolean options.flags.multiline)
    -- , onInput = \value -> UpdateNodeMessage id (Flags { expression = expression, flags = { options.flags | multiline = value } })
    False
  ]
  

viewAutoListProperties : String -> List NodeId -> List (Html Message)
viewAutoListProperties name connectedNodes = 
  let 
    connected = List.map
      (\node -> viewProperty name (Connected (Just node)) False)
      connectedNodes
  in connected ++ [ viewProperty name (Connected Nothing) False ]

viewProperty : String -> InputView -> Bool -> Html Message -- : { name : String, isOutput : Bool, input : InputView } -> Html Message
viewProperty name input isOutput = div
  [ class (prependStringIf "property" "main " (isOutput && input == NoInput)) ]
  [ div [ class "left connector" ] []
  , span [ class "title" ] [ text name ]
  , viewInput input
  , div [ class (prependStringIf "right connector" "inactive " (not isOutput)) ] []
  ]


type InputView
  = Characters String
  | Character Char
  | Integer Int
  | Boolean Bool
  | Connected (Maybe NodeId)
  | NoInput -- for `Title Properties`

viewInput : InputView -> Html Message
viewInput inputView = case inputView of
  Characters chars -> input
    [ placeholder "Add Nodes"
    , value chars
    , onInput (\text -> SearchMessage (UpdateSearch text))
    , class "chars input"
    ]
    []

  _ -> div [] []


translateHTML = translate "px"  
translateSVG = translate ""  
translate unit position = style "transform" ("translate(" ++ (String.fromFloat position.x) ++ unit ++ "," ++ (String.fromFloat position.y) ++ unit ++ ")") 
