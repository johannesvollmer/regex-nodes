module Main exposing (..)

import Browser
import Html exposing (..)
import Css exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onBlur, onFocus)
import Dict exposing (Dict)
import Array exposing (Array)
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
    Flags { expression, flags } -> build expression -- we use flags directly at topmost level 
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

buildRegex : Nodes -> Maybe NodeId -> RegexBuild
buildRegex nodes id =
  let
    expression = buildExpression nodes id
    nodeView = Maybe.andThen (\i -> Dict.get i nodes.values) id
    options = case Maybe.map .node nodeView of
      Just (Flags { flags }) -> flags
      _ -> defaultFlags
  in RegexBuild expression options

compileRegex : RegexBuild -> Regex.Regex 
compileRegex build = 
  let options = { caseInsensitive = not build.flags.caseSensitive, multiline = build.flags.multiline }
  in Regex.fromStringWith options build.expression |> Maybe.withDefault Regex.never


defaultFlags = RegexFlags True True True


justOkOrErr : x -> Maybe a -> Result x a
justOkOrErr error maybe = case maybe of
    Just value -> Ok value
    Nothing -> Err error





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
          { model | dragMode = Just (MoveNodeDrag { node = node, mouse = mouse }) }

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
  div 
    ([ Mouse.onMove (\event -> DragModeMessage (UpdateDrag { newMouse = Vec2.fromTuple event.clientPos })) 
    , Mouse.onUp (\event -> DragModeMessage FinishDrag) 
    , Mouse.onLeave (\event -> DragModeMessage FinishDrag) 
    , class "fullscreen"
    ]) 

    [ nav []
      [ text "Regex Nodes"

      , div []
        [ input 
            [ placeholder "Add Nodes"
            , value (Maybe.withDefault "" model.search)
            , onFocus (SearchMessage (UpdateSearch ""))
            , onInput (\text -> SearchMessage (UpdateSearch text))
            , onBlur (SearchMessage (FinishSearch Nothing))
            ] []
        , div [] (Maybe.withDefault [] (Maybe.map viewSearch model.search) )
        ]
      ]
    , div
        [] -- (overflowing ++ [style "transform" ("translate(" ++ model.view.offset.x ++ "px " ++ model.view.offset.y ++ "px)")]) 
        (List.map viewNode (Dict.toList model.nodes.values))
    ]



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
    :: (class "graph-node") :: [translateHTML node.position] --unpositioned
    ) 

    (case node.node of
      Whitespace -> viewWhitespaceProperties
      CharSet chars -> viewCharSetProperties chars
      Optional option -> viewOptionalProperties option
      Set options -> viewSetProperties options
      Flags flags -> viewFlagsProperties flags
      _ -> [ viewProperty { name = "Unimplemented", isOutput = False, input = NoInput } ]
    )


viewWhitespaceProperties : List (Html Message)
viewWhitespaceProperties = [ viewProperty { name = typeNames.whitespace, isOutput = True, input = NoInput } ]

viewCharSetProperties : String -> List (Html Message)
viewCharSetProperties chars = [ viewProperty { name = typeNames.charset, isOutput = True, input = Characters chars }  ]

viewOptionalProperties : Maybe NodeId -> List (Html Message)
viewOptionalProperties option = [ viewProperty { name = typeNames.optional, isOutput = True, input = Connected option } ]

viewSetProperties : List NodeId -> List (Html Message)
viewSetProperties options = 
  [ viewProperty { name = typeNames.set, isOutput = True, input = NoInput } ]
  ++ viewAutoListProperties "Option" options

viewFlagsProperties : { expression : Maybe NodeId, flags : RegexFlags } -> List (Html Message)
viewFlagsProperties options = 
  [ viewProperty { name = typeNames.flags, isOutput = False, input = Connected options.expression }
  , viewProperty { name = "Multiple Matches", isOutput = False, input = Boolean options.flags.multiple }
  , viewProperty { name = "Case Sensitive", isOutput = False, input = Boolean options.flags.caseSensitive }
  , viewProperty 
    { name = "Multiline Matches"
    , input = Boolean options.flags.multiline
    -- , onInput = \value -> UpdateNodeMessage id (Flags { expression = expression, flags = { options.flags | multiline = value } })
    , isOutput = False
    }
  ] 
  

viewAutoListProperties : String -> List NodeId -> List (Html Message)
viewAutoListProperties name connectedNodes = 
  let 
    connected = List.map
      (\node -> viewProperty { name = name, isOutput = False, input = Connected (Just node) } )
      connectedNodes
  in connected ++ [ viewProperty { name = name, isOutput = False, input = Connected Nothing } ]

viewProperty : { name : String, isOutput : Bool, input : InputView } -> Html Message
viewProperty property = div 
  [] 
  [ text property.name, viewInput property.input ]


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
    ]
    []

  _ -> div [] []


translateHTML = translate "px"  
translateSVG = translate ""  
translate unit position = style "transform" ("translate(" ++ (String.fromFloat position.x) ++ unit ++ "," ++ (String.fromFloat position.y) ++ unit ++ ")") 
