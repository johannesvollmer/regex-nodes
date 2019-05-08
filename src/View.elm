module View exposing (..)

import Array exposing (Array)
import Html exposing (..)
import Html.Lazy exposing (lazy)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onBlur, onFocus)
import Dict exposing (Dict)
import Html.Events.Extra.Mouse as Mouse
import Html.Events.Extra.Wheel as Wheel
import Svg exposing (Svg, svg, line, g)
import Svg.Attributes exposing (x1, x2, y1, y2)
import Regex
import Json.Decode
import Json.Encode

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
    SymbolNode symbol -> [ PropertyView (symbolName symbol) TitleProperty True ]
    CharSetNode chars -> [ PropertyView typeNames.charset (CharsProperty chars CharSetNode) True ]
    NotInCharSetNode chars -> [ PropertyView typeNames.notInCharset (CharsProperty chars NotInCharSetNode) True ]
    LiteralNode literal -> [ PropertyView typeNames.literal (CharsProperty literal LiteralNode) True ]

    CaptureNode captured -> [ PropertyView typeNames.capture (ConnectingProperty captured CaptureNode) True ]

    CharRangeNode start end ->
      [ PropertyView typeNames.charRange TitleProperty True
      , PropertyView "First Char" (CharProperty start (updateCharRangeFirst end)) False
      , PropertyView "Last Char" (CharProperty end (updateCharRangeLast start)) False
      ]

    NotInCharRangeNode start end ->
      [ PropertyView typeNames.notInCharRange TitleProperty True
      , PropertyView "First Char" (CharProperty start (updateNotInCharRangeFirst end)) False
      , PropertyView "Last Char" (CharProperty end (updateNotInCharRangeLast start)) False
      ]

    SetNode options ->
      [ PropertyView typeNames.set TitleProperty True
      , PropertyView "Option" (ConnectingProperties options SetNode) False
      ]

    SequenceNode members ->
      [ PropertyView typeNames.sequence TitleProperty True
      , PropertyView "And Then" (ConnectingProperties members SequenceNode) False
      ]

    FlagsNode flagsNode ->
      [ PropertyView typeNames.flags (ConnectingProperty flagsNode.expression (updateFlagsExpression flagsNode)) False
      , PropertyView "Multiple Matches" (BoolProperty flagsNode.flags.multiple (updateFlagsMultiple flagsNode)) False
      , PropertyView "Case Insensitive" (BoolProperty flagsNode.flags.caseSensitive (updateFlagsInsensitivity flagsNode)) False
      , PropertyView "Multiline Matches" (BoolProperty flagsNode.flags.multiline (updateFlagsMultiline flagsNode)) False
      ]

    IfFollowedByNode followed ->
      [ PropertyView typeNames.ifFollowedBy (ConnectingProperty followed.expression (updateFollowedByExpression followed)) True
      , PropertyView "Successor" (ConnectingProperty followed.successor (updateFollowedBySuccessor followed)) False
      ]

    IfNotFollowedByNode followed ->
      [ PropertyView typeNames.ifNotFollowedBy (ConnectingProperty followed.expression (updateNotFollowedByExpression followed)) True
      , PropertyView "Successor" (ConnectingProperty followed.successor (updateNotFollowedBySuccessor followed)) False
      ]

    IfAtEndNode atEnd ->  [ PropertyView typeNames.ifAtEnd (ConnectingProperty atEnd IfAtEndNode) True ]
    IfAtStartNode atStart ->  [ PropertyView typeNames.ifAtStart (ConnectingProperty atStart IfAtStartNode) True ]


    OptionalNode option -> [ PropertyView typeNames.optional (ConnectingProperty option OptionalNode) True ]
    AtLeastOneNode counted -> [ PropertyView typeNames.atLeastOne (ConnectingProperty counted AtLeastOneNode) True ]
    AnyRepetitionNode counted -> [ PropertyView typeNames.anyRepetition (ConnectingProperty counted AnyRepetitionNode) True ]

    ExactRepetitionNode repetition ->
      [ PropertyView typeNames.exactRepetition (ConnectingProperty repetition.expression (updateExactRepetitionExpression repetition)) True
      , PropertyView "Count" (IntProperty repetition.count (updateExactRepetitionCount repetition)) False
      ]

    RangedRepetitionNode counted ->
      [ PropertyView typeNames.rangedRepetition (ConnectingProperty counted.expression (updateRangedRepetitionExpression counted)) True
      , PropertyView "Minimum" (IntProperty counted.minimum (updateRangedRepetitionMinimum counted)) False
      , PropertyView "Maximum" (IntProperty counted.maximum (updateRangedRepetitionMaximum counted)) False
      ]

    MinimumRepetitionNode counted ->
      [ PropertyView typeNames.minimumRepetition (ConnectingProperty counted.expression (updateMinimumRepetitionExpression counted)) True
      , PropertyView "Count" (IntProperty counted.minimum (updateMinimumRepetitionCount counted)) False
      ]

    MaximumRepetitionNode counted ->
      [ PropertyView typeNames.maximumRepetition (ConnectingProperty counted.expression (updateMaximumRepetitionExpression counted)) True
      , PropertyView "Count" (IntProperty counted.maximum (updateMaximumRepetitionCount counted)) False
      ]


propertyHeight = 25

-- TODO dry
nodeWidth node = case node of
  SymbolNode symbol -> symbol |> symbolName |> mainTextWidth
  CharSetNode chars -> mainTextWidth typeNames.charset + codeTextWidth chars + 3
  NotInCharSetNode chars -> mainTextWidth typeNames.charset + codeTextWidth chars + 3
  CharRangeNode _ _ -> mainTextWidth typeNames.charRange
  NotInCharRangeNode _ _ -> mainTextWidth typeNames.notInCharRange
  LiteralNode chars -> mainTextWidth typeNames.literal + codeTextWidth chars + 3
  OptionalNode _ -> mainTextWidth typeNames.optional
  SetNode _ -> mainTextWidth typeNames.set
  FlagsNode _ -> mainTextWidth typeNames.flags
  IfFollowedByNode _ -> mainTextWidth typeNames.ifFollowedBy
  ExactRepetitionNode _ -> mainTextWidth typeNames.exactRepetition
  SequenceNode _ -> mainTextWidth typeNames.sequence
  CaptureNode _ -> mainTextWidth typeNames.capture
  IfAtEndNode _ -> mainTextWidth typeNames.ifAtEnd
  IfAtStartNode _ -> mainTextWidth typeNames.ifAtStart
  IfNotFollowedByNode _ -> mainTextWidth typeNames.ifNotFollowedBy
  AtLeastOneNode _ -> mainTextWidth typeNames.atLeastOne
  AnyRepetitionNode _ -> mainTextWidth typeNames.anyRepetition
  RangedRepetitionNode _ -> mainTextWidth typeNames.rangedRepetition
  MinimumRepetitionNode _ -> mainTextWidth typeNames.minimumRepetition
  MaximumRepetitionNode _ -> mainTextWidth typeNames.maximumRepetition



-- Thanks, Html, for letting us hardcode those values.
codeTextWidth = String.length >> (*) 5 >> toFloat
mainTextWidth text =
  let length = text |> String.length |> toFloat
  in length * if length < 14 then 11 else 9


-- VIEW

-- TODO use lazy html!

view : Model -> Html Message
view model =
  let
    regex = model.result |> Maybe.map (buildRegex model.nodes)

    expressionResult = regex |> Maybe.map (Result.map constructRegexLiteral)

    (moveDragging, connectDragId, mousePosition) = case model.dragMode of
        Just (MoveNodeDrag { mouse }) -> (True, Nothing, mouse)
        Just (CreateConnection { supplier, openEnd }) -> (False, Just supplier, openEnd)
        _ -> (False, Nothing, Vec2 0 0)

    connectDragging = connectDragId /= Nothing

    nodeViews = (List.map (viewNode model.dragMode model.nodes) (Dict.toList model.nodes.values))

    connections = flattenList (List.map .connections nodeViews)



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
    , classes "" [(moveDragging, "move-dragging"), (connectDragging, "connect-dragging"), (model.exampleText.isEditing, "editing-example-text")]
    ]

    [ lazy viewExampleText model.exampleText

    , svg [ id "connection-graph" ]
      [ g [ magnifyAndOffsetSVG model.view ]
        (if connectDragging then connections ++ [ viewConnectDrag model.view model.nodes connectDragId mousePosition ] else connections)
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
          [ img [ src "html/img/logo.svg" ] []
          , h1 [] [ text "Regex Nodes" ]
          , a
            [ href "https://github.com/johannesvollmer/regex-nodes", target "_blank", rel "noopener noreferrer" ]
            [ text "by johannes vollmer" ]
          ]

        , div
          [ id "edit-example"
          , checked model.exampleText.isEditing
          , Mouse.onClick (\_ -> SetEditingExampleText (not model.exampleText.isEditing))
          ]
          [ text "Edit Example" ]
        ]

        , div [ id "search" ]
          [ viewSearchBar model.search
          , viewSearchResults model.search
          ]

        , div [ id "expression-result" ]
          [ code [] [ text ("const regex = " ++ (expressionResult |> Maybe.withDefault (Ok "/(?!)/") |> Result.withDefault "Error")) ] ]
      ]
    ]


preventContextMenu message = Mouse.onWithOptions "contextmenu"
  { preventDefault = True, stopPropagation = True }
  (\_ -> message)

viewSearchResults search =
  div
    [ id "results"
    , stopMousePropagation "wheel"
    ]
    (Maybe.withDefault [] (Maybe.map viewSearch search) )

viewSearchBar search = input
  [ placeholder "Add Nodes"
  , type_ "text"
  , value (Maybe.withDefault "" search)
  , onFocus (SearchMessage (UpdateSearch ""))
  , onInput (\text -> SearchMessage (UpdateSearch text))
  , onBlur (SearchMessage (FinishSearch NoResult))
  ] []



viewSearch : String -> List (Html Message)
viewSearch query =
  let
    isEmpty = String.isEmpty query
    lowercaseQuery = String.toLower query
    regex = Maybe.withDefault Regex.never (Regex.fromStringWith { caseInsensitive = True, multiline = False } query)

    test name = isEmpty || String.contains lowercaseQuery (String.toLower name) || (Regex.contains regex name)
    matches prototype = test prototype.name

    position = Vec2 (400) (300)
    render prototype = div
      [ Mouse.onWithOptions
        "mousedown"
        { stopPropagation = False, preventDefault = False } -- do not prevent blurring the textbox on selecting a result
        (\_ -> SearchMessage (FinishSearch (InsertPrototype (Model.NodeView position prototype.node))))
      ]
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

  in prependListIf (not isEmpty) asRegex results


-- TODO use Html.Lazy!!!

viewExampleText example =
  if example.isEditing
    then textarea [ id "example-text", onInput UpdateExampleText ]
      [ text example.contents ]

    else
      let
        texts = example.cachedMatches |> Maybe.map viewExampleTexts
          |> Maybe.withDefault [ text example.contents ]

      in div [ id "example-text" ] texts


viewExampleTexts : List (String, String) -> List (Html Message)
viewExampleTexts matches =
  let
    render matchPair =
      [ Html.text (Tuple.first matchPair)
      , span [ class "match" ] [ Html.text (Tuple.second matchPair) ]
      ]

  in matches |> List.concatMap render


viewNode : Maybe DragMode -> Nodes -> (NodeId, Model.NodeView) -> NodeView
viewNode dragMode nodes (nodeId, nodeView) =
  let props = properties nodeView.node in
  NodeView (viewNodeContent dragMode nodeId props nodeView) (viewNodeConnections nodes props nodeView)


viewNodeConnections : Nodes -> List PropertyView -> Model.NodeView -> List (Svg Message)
viewNodeConnections nodes props nodeView =
  let
    connectionLine from width to index = Svg.path
      [ Svg.Attributes.class "connection"
      , bezierSvgConnectionpath
        (Vec2 to.x (to.y + ((toFloat index) + 0.5) * propertyHeight))
        (Vec2 (from.x + width) (from.y + 0.5 * propertyHeight))
      ]
      []

    connect : NodeId -> Model.NodeView -> (Int -> Maybe (Svg Message))
    connect supplierId node index =
      let
        supplier = Dict.get supplierId nodes.values
        viewSupplier supplierNodeView =
          connectionLine supplierNodeView.position (nodeWidth supplierNodeView.node) node.position index

      in Maybe.map viewSupplier supplier

    viewInputConnection : PropertyView -> List (Int -> Maybe (Svg Message))
    viewInputConnection property = case property.contents of
        ConnectingProperty (Just supplier) _ ->
          [ connect supplier nodeView ]

        ConnectingProperties suppliers _ ->
          suppliers |> Array.toList |> List.map (\supplier -> connect supplier nodeView)

        _ ->  [ (\index -> Nothing) ]

    flattened = props |> List.map viewInputConnection |> flattenList
    indexed = flattened |> List.indexedMap (\index at -> at index)
    filtered = List.filterMap identity indexed

  in filtered


viewConnectDrag : View -> Nodes -> Maybe NodeId -> Vec2 -> Html Message
viewConnectDrag viewTransformation nodes dragId mouse =
  let
    node = Maybe.andThen (\id -> Dict.get id nodes.values) dragId
    nodePosition = Maybe.map (.position) node |> Maybe.withDefault (Vec2 0 0)

    nodeAnchor = Vec2
      (nodePosition.x + (Maybe.map (.node >> nodeWidth) node |> Maybe.withDefault 0))
      (nodePosition.y + 0.5 * 25.0)

    transform = viewTransform viewTransformation
    transformedMouse = Vec2.inverseTransform mouse transform

  in Svg.path
    [ Svg.Attributes.class "prototype connection"
    , bezierSvgConnectionpath transformedMouse nodeAnchor
    ]
    []


bezierSvgConnectionpath from to =
  let
    tangentX1 = from.x - abs(to.x - from.x) * 0.4
    tangentX2 = to.x + abs(to.x - from.x) * 0.4

  in svgConnectionPath
    from (Vec2 tangentX1 from.y) (Vec2 tangentX2 to.y) to

svgConnectionPath from fromTangent toTangent to =
  let
    vec2ToString vec = String.fromFloat vec.x ++ "," ++ String.fromFloat vec.y ++ " "
    path = "M" ++ vec2ToString from ++ "C" ++ vec2ToString fromTangent
      ++ vec2ToString toTangent ++ vec2ToString to
  in Svg.Attributes.d path


hasDragConnectionPrototype dragMode nodeId = case dragMode of
    Just (CreateConnection { supplier }) -> nodeId == supplier
    _ -> False

viewNodeContent : Maybe DragMode -> NodeId -> List PropertyView -> Model.NodeView -> Html Message
viewNodeContent dragMode nodeId props nodeView =
  let
    mayDragConnect = case dragMode of
      Just (PrepareEditingConnection { node }) -> nodeId == node
      Just (RetainPrototypedConnection { node }) -> nodeId == node -- TODO test
      _ -> False

    onClick event =
      if event.button == Mouse.SecondButton then
        DragModeMessage (StartPrepareEditingConnection { node = nodeId, mouse = Vec2.fromTuple event.clientPos })

      else DragModeMessage (StartNodeMove { node = nodeId, mouse = Vec2.fromTuple event.clientPos })

  in div
    [ Mouse.onDown onClick
    , classes "graph-node" [(hasDragConnectionPrototype dragMode nodeId, "connecting"), (mayDragConnect, "may-drag-connect")]
    , style "width" ((String.fromFloat (nodeWidth nodeView.node)) ++ "px")
    , translateHTML nodeView.position
    ]

    (viewProperties nodeId dragMode props)


-- TODO pattern match only once inside this function

viewProperties : NodeId -> Maybe DragMode -> List PropertyView -> List (Html Message)
viewProperties nodeId dragMode props =
  let

    mayStartConnectDrag = case dragMode of
        Just (PrepareEditingConnection { node }) -> nodeId == node
        Just (RetainPrototypedConnection { node }) -> nodeId == node
        _ -> False

    enableDisconnect = case dragMode of
       Just (PrepareEditingConnection _) -> True
       Just (RetainPrototypedConnection _) -> True
       _ -> False

    onLeave : Maybe { supplier: Maybe NodeId, onChange: OnChange (Maybe NodeId) } -> Bool -> Mouse.Event -> Message
    onLeave input output event = DragModeMessage (
        case dragMode of
          -- Just (RetainPrototypedConnection { mouse }) -> TODO

          Just (PrepareEditingConnection { mouse }) ->
            case input of
              Just { supplier, onChange } ->
                if (Tuple.first event.clientPos) < mouse.x && supplier /= Nothing then
                   StartEditingConnection { supplier = supplier, node = onChange Nothing, nodeId = nodeId, mouse = Vec2.fromTuple event.clientPos }

                else if output then StartCreateConnection { supplier = nodeId, mouse = Vec2.fromTuple event.clientPos }
                else FinishDrag

              Nothing -> if output then StartCreateConnection { supplier = nodeId, mouse = Vec2.fromTuple event.clientPos }
                else FinishDrag

          _ -> UpdateDrag { newMouse = Vec2.fromTuple event.clientPos }
      )

    leftConnector active = div
      [ (classes "left connector" [(not active, "inactive")]) ]
      []

    rightConnector active = div
      [ (classes "right connector" [(not active, "inactive")]) ]
      []


    propertyHTML: List (Attribute Message) -> Html Message -> String -> Bool -> Html Message -> Html Message -> Html Message
    propertyHTML attributes directInput name connectableInput left right = div
      ((classes "property" [(connectableInput, "connectable-input")]) :: attributes) -- FIXME only on leave if property.connectoutput

      [ left
      , span [ class "title" ] [ text name ]
      , directInput
      , right
      ]

    updateNode = UpdateNodeMessage nodeId

    simpleInputProperty property directInput = propertyHTML
      [ Mouse.onLeave (onLeave Nothing property.connectOutput) ] directInput property.name False (leftConnector False) (rightConnector property.connectOutput)

    connectInputProperty property currentSupplier onChange =
      let
        connectOnEnter supplier event =
          DragModeMessage (RealizeConnection { mouse = Vec2.fromTuple event.clientPos, nodeId = nodeId, newNode = onChange (Just supplier) })

        onEnter = case dragMode of
          Just (CreateConnection { supplier }) ->
            if supplier == nodeId then [] else -- TODO check for real cycles
              [ Mouse.onEnter (connectOnEnter supplier) ]

          _ -> []

        onLeaveHandlers = if enableDisconnect && mayStartConnectDrag
            then [ Mouse.onLeave (onLeave (Just { supplier = currentSupplier, onChange = onChange }) property.connectOutput) ] else []

        left = leftConnector True

      in propertyHTML (onEnter ++ onLeaveHandlers) (div[][]) property.name True left (rightConnector property.connectOutput)

    singleProperty property = case property.contents of
      BoolProperty value onChange -> [ simpleInputProperty property (viewBoolInput value (onChange (not value) |> updateNode)) ]
      CharsProperty chars onChange -> [ simpleInputProperty property (viewCharsInput chars (onChange >> updateNode)) ]
      CharProperty char onChange -> [ simpleInputProperty property (viewCharInput char (onChange >> updateNode)) ]
      IntProperty number onChange -> [ simpleInputProperty property (viewIntInput number (onChange >> updateNode)) ]
      ConnectingProperty currentSupplier onChange -> [ connectInputProperty property currentSupplier onChange ]

      ConnectingProperties connectedProps onChange ->
        let
          onChangePropertyAtIndex index newInput = case newInput of
             Just newInputId -> onChange (Array.set index newInputId connectedProps)
             Nothing -> onChange (removeFromArray index connectedProps)

          onChangeStubProperty newInput = case newInput of
            Just newInputId -> onChange (Array.push newInputId connectedProps)
            Nothing -> onChange (removeFromArray ((Array.length connectedProps) - 1) connectedProps)

          realProperties = Array.toList <| Array.indexedMap
            (\index currentSupplier -> connectInputProperty property (Just currentSupplier) (onChangePropertyAtIndex index))
            connectedProps

          stubProperty = connectInputProperty property Nothing onChangeStubProperty
        in realProperties ++ [ stubProperty ]


      TitleProperty -> [ propertyHTML [ Mouse.onLeave (onLeave Nothing True) ] (div[][]) property.name False (leftConnector False) (rightConnector property.connectOutput) ]

  in
    flattenList (List.map singleProperty props)


onMouseWithStopPropagation eventName eventHandler = Mouse.onWithOptions
  eventName { preventDefault = False, stopPropagation = True } eventHandler

stopMousePropagation eventName = onMouseWithStopPropagation eventName
  (\event -> DragModeMessage (UpdateDrag { newMouse = Vec2.fromTuple event.clientPos }))

viewBoolInput : Bool -> Message -> Html Message
viewBoolInput value onToggle = input
  [ type_ "checkbox"
  , checked value
  , onMouseWithStopPropagation "click" (\_ -> onToggle)
  , stopMousePropagation "mousedown"
  , stopMousePropagation "mouseup"
  ]
  []


viewCharsInput : String -> (String -> Message) -> Html Message
viewCharsInput chars onChange = input
  [ type_ "text"
  , placeholder "!?:;aeiou"
  , value chars
  , onInput onChange
  , class "chars input"
  , stopMousePropagation "mousedown"
  , stopMousePropagation "mouseup"
  ]
  []

viewCharInput : Char -> (Maybe Char -> Message) -> Html Message
viewCharInput char onChange = input
  [ type_ "text"
  , placeholder "a"
  , value (String.fromChar char)

  -- Take the last char of the string
  , onInput (\chars -> onChange (chars |> String.right 1 |> String.uncons |> Maybe.map Tuple.first))

  , class "char input"
  , stopMousePropagation "mousedown"
  , stopMousePropagation "mouseup"
  ]
  []

viewIntInput : Int -> (Int -> Message) -> Html Message
viewIntInput number onChange = input
  [ type_ "number"
  , value (String.fromInt number)
  , onInput (\newValue -> onChange (newValue |> String.toInt |> Maybe.withDefault 0))
  , class "int input"
  , stopMousePropagation "mousedown"
  , stopMousePropagation "mouseup"
  ]
  []



flattenList list = List.foldr (++) [] list

removeFromList index list =
  List.take index list ++ List.drop (index + 1) list

removeFromArray index =
  Array.toList >> removeFromList index >> Array.fromList

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

