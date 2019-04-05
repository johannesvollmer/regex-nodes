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

type alias RegexFlags =
  { multiple : Bool
  , caseSensitive : Bool
  , multiline : Bool
  }

type alias Vec2 =
  { x : Float
  , y : Float
  }


justOkOrErr : x -> Maybe a -> Result x a
justOkOrErr error maybe = case maybe of
    Just value -> Ok value
    Nothing -> Err error


addVec2 : Vec2 -> Vec2 -> Vec2
addVec2 a b = Vec2 (a.x + b.x) (a.y + b.y)

subVec2 : Vec2 -> Vec2 -> Vec2
subVec2 a b = Vec2 (a.x - b.x) (a.y - b.y)

tupleToVec2 : (Float, Float) -> Vec2
tupleToVec2 value = Vec2 (Tuple.first value) (Tuple.second value)


prototypes : List Node
prototypes = 
  [ Whitespace
  , CharSet ",.?!:"
  , Optional Nothing
  , Set []
  , Flags { expression = Nothing, flags = defaultFlags }
  , Repeated { expression = Nothing, count = 3 }
  , IfFollowedBy { expression = Nothing, successor = Nothing }
  ]

typeName : Node -> String
typeName node = case node of
  Whitespace -> "Whitespace Char"
  CharSet _ -> "Char Set"
  Optional _ -> "Optional"
  Set _ -> "Any Of"
  Flags _ -> "Flags"
  Repeated _ -> "Repeated"
  IfFollowedBy _ -> "If Followed By"

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


moveNode : Nodes -> NodeId -> Vec2 -> Nodes
moveNode nodes nodeId movement = 
  let updateNodePosition node = Maybe.map (\n -> { n | position = addVec2 n.position movement }) node
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





-- UPDATE

type Message
  = SearchMessage SearchMessage
  | DragModeMessage DragModeMessage

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
              let delta = subVec2 newMouse mouse in 
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
    ([  Mouse.onMove (\event -> DragModeMessage (UpdateDrag { newMouse = tupleToVec2 event.clientPos })) 
    , Mouse.onUp (\event -> DragModeMessage FinishDrag) 
    , Mouse.onLeave (\event -> DragModeMessage FinishDrag) 
    ] ++ layer) 

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
        -- (List.map viewNode (Dict.values model.graph.nodes))
        (List.map viewNode (Dict.toList model.nodes.values))
    ]



viewSearch : String -> List (Html Message)
viewSearch query =
  let 
    regex = Maybe.withDefault Regex.never (Regex.fromString query)
    test name = (String.isEmpty query) || (Regex.contains regex name)
    filter prototype = test (typeName prototype)
    position = Vec2 (400) (300)
    render prototype = div 
      ( [ Mouse.onWithOptions
        "mousedown"
        { stopPropagation = False, preventDefault = False } -- do not prevent blurring the textbox on selecting a result
        (\_ -> SearchMessage (FinishSearch (Just (NodeView position prototype))))
      , buttonCursor
      ] ) -- [ Mouse.onDown (\_ -> SearchMessage (FinishSearch (Just (NodeView position prototype)))) ] -- TODO do not prevent default, unfocusing the textbox
      [ text (typeName prototype) ]
  in prototypes |> List.filter filter |> List.map render

viewNode : (NodeId, NodeView) -> Html Message
viewNode (nodeId, node) =
  div
    (  Mouse.onDown (\event -> DragModeMessage (StartNodeMove { node = nodeId, mouse = tupleToVec2 event.clientPos }))
    :: (translateHTML node.position) :: unpositioned
    ) 
    [(case node.node of
      Whitespace -> viewProperty { name = "Whitespace Char", isOutput = True, input = None }
      Optional input -> viewProperty { name = "Optional", isOutput = True, input = Connected input }
      _ -> viewProperty { name = "[Unknown]", isOutput = False, input = None }
    )]

viewProperty : { name : String, isOutput : Bool, input : InputView } -> Html Message
viewProperty property = div 
  [] 
  [ text property.name, viewInput property.input ]

type InputView
  = Characters String
  | Character Char
  | Integer Int
  | Connected (Maybe NodeId)
  | None -- for `Title Properties`

viewInput : InputView -> Html Message
viewInput inputView = case inputView of
  Characters chars -> input [ placeholder "Characters" ] []
  _ -> div [] []


layer = unpositioned ++ fullsized ++ noSpacing
unpositioned = [ style "position" "absolute", style "top" "0", style "left" "0" ]
overflowing = style "overflow" "visible" 
fullsized = [ style "width" "100vw", style "height" "100vh", style "overflow" "hidden" ]
noSpacing = [ noMargin, noPadding ] 
noMargin = style "margin" "0" 
noPadding = style "padding" "0" 

translateHTML = translate "px"  
translateSVG = translate ""  
translate unit position = style "transform" ("translate(" ++ (String.fromFloat position.x) ++ unit ++ "," ++ (String.fromFloat position.y) ++ unit ++ ")") 

buttonCursor =  style "cursor" "pointer" 