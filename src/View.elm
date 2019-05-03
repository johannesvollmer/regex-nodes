module View exposing (..)

import Array exposing (Array)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onBlur, onFocus)
import Dict exposing (Dict)
import Html.Events.Extra.Mouse as Mouse
import Html.Events.Extra.Wheel as Wheel
import Svg exposing (Svg, svg, line, g)
import Svg.Attributes exposing (x1, x2, y1, y2)
import Regex

import Vec2 exposing (Vec2)
import Model exposing (..)
import Build exposing (..)
import Update exposing (..)



type alias PropertyView =
  { name : String
  , contents : PropertyViewContents
  , connectOutput : Bool
  }

-- if a property must be updated, return the whole new node
type alias OnChange a = a -> Node

type PropertyViewContents
  = BoolProperty Bool (OnChange Bool)
  | CharsProperty String (OnChange String)
  | CharProperty Char (OnChange (Maybe Char))
  | IntProperty Int (OnChange Int)
  | ConnectingProperty (Maybe NodeId) (OnChange (Maybe NodeId))
  | ConnectingProperties (Array NodeId) (OnChange (Array NodeId))
  | TitleProperty

type alias NodeView =
  { node: Html Message
  , connections: List (Svg Message)
  }

properties : Node -> List PropertyView
properties node =
  case node of
    Whitespace -> [ PropertyView typeNames.whitespace TitleProperty True ]
    CharSet chars -> [ PropertyView typeNames.charset (CharsProperty chars (updateCharSetChars)) True ]
    Optional option -> [ PropertyView typeNames.optional (ConnectingProperty option (updateOptionalOption)) True ]

    Set options ->
      [ PropertyView typeNames.set TitleProperty True
      , PropertyView "Option" (ConnectingProperties options (updateSetOptions)) False
      ]

    Flags flagsNode ->
      [ PropertyView typeNames.flags (ConnectingProperty flagsNode.expression (updateFlagsExpression flagsNode)) False
      , PropertyView "Multiple Matches" (BoolProperty flagsNode.flags.multiple (updateFlagsMultiple flagsNode)) False
      , PropertyView "Case Insensitive" (BoolProperty flagsNode.flags.caseSensitive (updateFlagsInsensitivity flagsNode)) False
      , PropertyView "Multiline Matches" (BoolProperty flagsNode.flags.multiline (updateFlagsMultiline flagsNode)) False
      ]

    Repeated repetition ->
      [ PropertyView typeNames.repeated (ConnectingProperty repetition.expression (updateRepetitionExpression repetition)) True
      , PropertyView "Count" (IntProperty repetition.count (updateRepetitionCount repetition)) False
      ]

    IfFollowedBy followed ->
      [ PropertyView typeNames.ifFollowedBy (ConnectingProperty followed.expression (updateFollowedByExpression followed)) True
      , PropertyView "Successor" (ConnectingProperty followed.successor (updateFollowedBySuccessor followed)) False
      ]


nodeWidth node = case node of
  Whitespace -> 150
  CharSet _ -> 170
  Optional _ -> 100
  Set _ -> 80
  Flags _ -> 140
  IfFollowedBy _ -> 120
  Repeated _ -> 100



-- VIEW

view : Model -> Html Message
view model =
  let
    expressionResult = Maybe.map
      (\id -> buildRegex model.nodes id |> constructRegexLiteral)
      model.result

    (moveDragging, connectDragId, mousePosition) = case model.dragMode of
        Just (MoveNodeDrag { mouse }) -> (True, Nothing, mouse)
        Just (PrototypeConnectionDrag { supplier, openEnd }) -> (False, Just supplier, openEnd)
        _ -> (False, Nothing, Vec2 0 0)

    connectDragging = connectDragId /= Nothing

    nodeViews = (List.map (viewNode connectDragId connectDragId model.nodes) (Dict.toList model.nodes.values))

  in div
    [ Mouse.onMove (\event -> DragModeMessage
        (UpdateDrag { newMouse = Vec2.fromTuple event.clientPos })
      )

    , Mouse.onUp (\_ -> DragModeMessage FinishDrag)
    , Mouse.onLeave (\_ -> DragModeMessage FinishDrag)

    , Wheel.onWheel (\event -> UpdateView (MagnifyView
      { amount = (if event.deltaY < 0 then 1 else -1)
      , focus = (Vec2.fromTuple event.mouseEvent.clientPos)
      }))

    , id "main"
    , classes "" [(moveDragging, "move-dragging"), (connectDragging, "connect-dragging")]
    ]

    [ svg [ id "connection-graph" ]
      [ g [ magnifyAndOffsetSVG model.view ]
        (prependListIf connectDragging (viewConnectDrag model.view model.nodes connectDragId mousePosition) (flattenList (List.map .connections nodeViews)))
      ]

    , div
      [ id "node-graph"
      , preventContextMenu (DragModeMessage FinishDrag)
      ]

      [ div [ class "transform-wrapper", magnifyAndOffsetHTML model.view ]
        (List.map .node nodeViews)
      ]

    , div [ id "overlay" ]
      [ nav []
        [ header []
          [ img [ src "img/logo.svg" ] []
          , h1 [] [ text "Regex Nodes" ]
          , a
            [ href "https://github.com/johannesvollmer/regex-nodes", target "_blank", rel "noopener noreferrer" ]
            [ text "by johannes vollmer" ]
          ]
        ]

        , div [ id "search" ]
          [ viewSearchBar model.search
          , viewSearchResults model.search
          ]

        , div [ id "expression-result" ]
          [ code [] [ text ("const regex = " ++ (Maybe.withDefault "/(?!)/" expressionResult)) ] ]
      ]
    ]


preventContextMenu message = Mouse.onWithOptions "contextmenu"
  { preventDefault = True, stopPropagation = True }
  (\_ -> message)

viewSearchResults search =
  div [ id "results" ] (Maybe.withDefault [] (Maybe.map viewSearch search) )

viewSearchBar search = input
  [ placeholder "Add Nodes"
  , value (Maybe.withDefault "" search)
  , onFocus (SearchMessage (UpdateSearch ""))
  , onInput (\text -> SearchMessage (UpdateSearch text))
  , onBlur (SearchMessage (FinishSearch NoResult))
  ] []



viewSearch : String -> List (Html Message)
viewSearch query =
  let
    isEmpty = String.isEmpty query
    regex = Maybe.withDefault Regex.never (Regex.fromStringWith { caseInsensitive = True, multiline = False } query)
    test name = isEmpty || (Regex.contains regex name)
    matches prototype = test prototype.name
    position = Vec2 (400) (300)
    render prototype = div
      [ Mouse.onWithOptions
        "mousedown"
        { stopPropagation = False, preventDefault = False } -- do not prevent blurring the textbox on selecting a result
        (\_ -> SearchMessage (FinishSearch (InsertPrototype (Model.NodeView position prototype.node))))
      --, buttonCursor
      ]  -- [ Mouse.onDown (\_ -> SearchMessage (FinishSearch (Just (NodeView position prototype)))) ] -- TODO do not prevent default, unfocusing the textbox
      [ text prototype.name ]

    asRegex = div
      [ Mouse.onWithOptions
        "mousedown"
        { stopPropagation = False, preventDefault = False } -- do not prevent blurring the textbox on selecting a result
        (\_ -> SearchMessage (FinishSearch (ParseRegex query)))
      ]
      [ text ("Add regular expression ")
      , span [ id "parse-regex" ] [ text query ]
      , text (" as Nodes")
      ]

    results = (prototypes |> List.filter matches |> List.map render)

  in
  prependListIf (not isEmpty) asRegex results




flattenList list = List.foldr (++) [] list
viewNode : Maybe NodeId -> Maybe NodeId -> Nodes -> (NodeId, Model.NodeView) -> NodeView
viewNode draggedId connectingId nodes (nodeId, nodeView) =
  let props = properties nodeView.node in
  NodeView (viewNodeContent draggedId (Just nodeId == connectingId) nodeId props nodeView) (viewNodeConnections nodes props nodeView)


viewNodeConnections : Nodes -> List PropertyView -> Model.NodeView -> List (Svg Message)
viewNodeConnections nodes props nodeView =
  let
    toConnections (index, property) connections = case property.contents of
      ConnectingProperty id _ -> Maybe.map (\i -> (index, i) :: connections) id |> Maybe.withDefault connections

      -- FIXME needs to increment index actually, not the same index every property!
      ConnectingProperties ids _ -> (Array.map (Tuple.pair index) ids |> Array.toList) ++ connections
      _ -> connections

    indexed = List.indexedMap (\index property -> (index, property)) props
    filtered = List.foldr toConnections [] indexed

  in
    List.map
      (\(index, input) ->
        let node = Dict.get input nodes.values
        in line
          [ x1 (String.fromFloat nodeView.position.x)
          , y1 (String.fromFloat (nodeView.position.y + ((toFloat index) + 0.5) * 25))
          , x2 (String.fromFloat (node |> Maybe.map (\n -> n.position.x + nodeWidth n.node) |> Maybe.withDefault 0))
          , y2 (String.fromFloat ((node |> Maybe.map (.position >> .y) |> Maybe.withDefault 0) + 0.5 * 25))
          , Svg.Attributes.class "connection"
          ]
          []
      )
      filtered


viewConnectDrag : View -> Nodes -> Maybe NodeId -> Vec2 -> Html Message
viewConnectDrag viewTransformation nodes dragId mouse =
  let
    node = Maybe.andThen (\id -> Dict.get id nodes.values) dragId
    position = Maybe.map (.position) node |> Maybe.withDefault (Vec2 0 0)
    transform = viewTransform viewTransformation
    transformedMouse = Vec2.inverseTransform mouse transform

  in line
    [ x1 (String.fromFloat transformedMouse.x)
    , y1 (String.fromFloat transformedMouse.y)
    , x2 (String.fromFloat (position.x + (Maybe.map (.node >> nodeWidth) node |> Maybe.withDefault 0)) )
    , y2 (String.fromFloat (position.y + 0.5 * 25.0))
    , Svg.Attributes.class "prototype connection"
    ]
    []



viewNodeContent : Maybe NodeId -> Bool -> NodeId -> List PropertyView -> Model.NodeView -> Html Message
viewNodeContent draggedId isConnecting nodeId props nodeView =  div
  [ -- Mouse.onDown (\event -> DragModeMessage (StartNodeMove { node = nodeId, mouse = Vec2.fromTuple event.clientPos }))
    Mouse.onDown
      (\event -> -- FIXME only if the first property has output
        if event.button == Mouse.SecondButton then
          DragModeMessage (StartPrototypeConnect { supplier = nodeId, mouse = Vec2.fromTuple event.clientPos })

        else DragModeMessage (StartNodeMove { node = nodeId, mouse = Vec2.fromTuple event.clientPos })
      )

  -- TODO right click start drag and prevent default
  , classes "graph-node" [(isConnecting, "connecting")]
  , style "width" ((String.fromFloat (nodeWidth nodeView.node)) ++ "px")
  , translateHTML nodeView.position
  ]

  (viewProperties nodeId draggedId props)


-- TODO pattern match only once inside this function

viewProperties : NodeId -> Maybe NodeId -> List PropertyView -> List (Html Message)
viewProperties nodeId draggedId props =
  let
    propertyHTML: List (Attribute Message) -> Html Message -> String -> Bool -> Bool -> Html Message
    propertyHTML attributes directInput name isInput isOutput = div
      ((classes "property" [(isInput, "connectable-input")]) :: attributes)

      [ div [ classes "left connector" [(not isInput, "inactive")] ] []
      , span [ class "title" ] [ text name ]
      , directInput
      , div [ classes "right connector" [(not isOutput, "inactive")] ] []
      ]

    updateNode = UpdateNodeMessage nodeId

    simpleInputProperty property directInput = propertyHTML
      [] directInput property.name False property.connectOutput

    connectInputProperty property onChange =
      let
        handlers = case draggedId of
          Just id -> -- FIXME make everything like this
            [ Mouse.onEnter (\_ -> DragModeMessage (ConnectPrototype { nodeId = nodeId, newNode = onChange (Just id) })) ]
          -- [ Mouse.onEnter (\_ -> onChange (Just id)) ]
          Nothing -> []

      in propertyHTML handlers (div[][]) property.name True property.connectOutput

    singleProperty property = case property.contents of
      BoolProperty value onChange -> [ simpleInputProperty property (viewBoolInput value (onChange (not value) |> updateNode)) ]
      CharsProperty chars onChange -> [ simpleInputProperty property (viewCharsInput chars (onChange >> updateNode)) ]
      CharProperty char onChange -> [ simpleInputProperty property (viewCharInput char (onChange >> updateNode)) ]
      IntProperty number onChange -> [ simpleInputProperty property (viewIntInput number (onChange >> updateNode)) ]
      ConnectingProperty _ onChange -> [ connectInputProperty property onChange ]

      ConnectingProperties connectedProps onChange ->
        let
          onChangeProperty index newInput = case newInput of
             Just newInputId -> onChange (Array.set index newInputId connectedProps)
             Nothing -> onChange connectedProps -- FIXME remove element on mouse leave


        in Array.toList <| Array.indexedMap
          (\index _ -> connectInputProperty property (onChangeProperty index))
          connectedProps

      TitleProperty -> [ propertyHTML [] (div[][]) property.name False property.connectOutput ]

  in
    flattenList (List.map singleProperty props)


viewBoolInput : Bool -> Message -> Html Message
viewBoolInput value onToggle = input
  [ type_ "checkbox"
  , checked value
  , Mouse.onClick (\_ -> onToggle)
  ]
  []


viewCharsInput : String -> (String -> Message) -> Html Message
viewCharsInput chars onChange = input
  [ type_ "text"
  , placeholder "!?:;aeiou"
  , value chars
  , onInput onChange
  , class "chars input"
  ]
  []

viewCharInput : Char -> (Maybe Char -> Message) -> Html Message
viewCharInput char onChange = input
  [ type_ "text"
  , placeholder "a"
  , value (String.fromChar char)
  , onInput (\chars -> onChange (chars |> String.uncons |> Maybe.map Tuple.first))
  , class "char input"
  ]
  []

viewIntInput : Int -> (Int -> Message) -> Html Message
viewIntInput number onChange = input
  [ type_ "number"
  , value (String.fromInt number)
  , onInput (\newValue -> onChange (newValue |> String.toInt |> Maybe.withDefault 0))
  , class "int input"
  ]
  []



prependListIf: Bool -> a -> List a -> List a
prependListIf condition element list =
    if condition then element :: list else list


classes : String -> List (Bool, String) -> Attribute Message
classes base elements = base ++ " " ++
  (List.filterMap (\(condition, class) -> if condition then Just class else Nothing) elements |> String.join " ")
  |> class


translateHTML = translate "px"
translate unit position = style "transform" ("translate(" ++ (String.fromFloat position.x) ++ unit ++ "," ++ (String.fromFloat position.y) ++ unit ++ ")")

magnifyAndOffsetHTML transformView = style "transform" (magnifyAndOffset "px" transformView)
magnifyAndOffsetSVG transformView = Svg.Attributes.transform (magnifyAndOffset "" transformView)
magnifyAndOffset unit transformView =
  let transform = viewTransform transformView
  in
    (  "translate(" ++ (String.fromFloat transform.translate.x) ++ unit ++ "," ++ (String.fromFloat transform.translate.y) ++ unit ++ ") "
    ++ "scale(" ++ (String.fromFloat transform.scale) ++ ")"
    )

