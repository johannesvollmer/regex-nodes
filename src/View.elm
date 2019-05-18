module View exposing (..)

import Array exposing (Array)
import Html exposing (..)
import Html.Lazy exposing (lazy)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onBlur, onFocus)
import Dict exposing (Dict)
import Html.Events.Extra.Mouse as Mouse
import Html.Events.Extra.Wheel as Wheel
import IdMap
import Svg exposing (Svg, svg, line, g)
import Svg.Attributes exposing (x1, x2, y1, y2)
import Regex
import Json.Decode

import Vec2 exposing (Vec2)
import Model exposing (..)
import Build exposing (..)
import Update exposing (..)



type alias NodeView =
  { node: Html Message
  , connections: List (Svg Message)
  }



propertyHeight = 25

nodeWidth node = case node of
  SymbolNode symbol -> symbol |> symbolName |> mainTextWidth
  CharSetNode chars -> mainTextWidth typeNames.charset + codeTextWidth chars + 3
  NotInCharSetNode chars -> mainTextWidth typeNames.charset + codeTextWidth chars + 3
  CharRangeNode _ _ -> mainTextWidth typeNames.charRange
  NotInCharRangeNode _ _ -> mainTextWidth typeNames.notInCharRange
  LiteralNode chars -> mainTextWidth typeNames.literal + codeTextWidth chars + 3
  OptionalNode _ -> stringWidth 10
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
mainTextWidth text = text |> String.length |> toFloat |> stringWidth
stringWidth length =  length * if length < 14 then 12 else 9

-- VIEW


view : Model -> Html Message
view model =
  let
    expressionResult = model.cachedRegex |> Maybe.map (Result.map constructRegexLiteral)

    (moveDragging, connectDragId, mousePosition) = case model.dragMode of
        Just (MoveNodeDrag { mouse }) -> (True, Nothing, mouse)
        Just (CreateConnection { supplier, openEnd }) -> (False, Just supplier, openEnd)
        _ -> (False, Nothing, Vec2 0 0)

    connectDragging = connectDragId /= Nothing

    nodeViews = (List.map (viewNode model.dragMode model.selectedNode model.outputNode.id model.nodes) (IdMap.toList model.nodes))

    connections = flattenList (List.map .connections nodeViews)

    startViewMove event =
      if event.button == Mouse.MiddleButton
        then DragModeMessage <| StartViewMove { mouse = Vec2.fromTuple event.clientPos }
        else Deselect

  in div
    [ conservativeOnMouse "mousemove" (\event -> DragModeMessage -- do not prevent default (which is text selection)
        (UpdateDrag { newMouse = Vec2.fromTuple event.clientPos })
      )

    , Mouse.onUp (always <| DragModeMessage FinishDrag)
    , Mouse.onLeave (always <| DragModeMessage FinishDrag)


    , id "main"
    , classes "" [(moveDragging, "move-dragging"), (connectDragging, "connect-dragging"), (model.exampleText.isEditing, "editing-example-text")]
    ]

    [ lazy viewExampleText model.exampleText

    , svg [ id "connection-graph" ]
      [ g [ magnifyAndOffsetSVG model.view ]
        (if connectDragging then connections ++ [ viewConnectDrag model.view model.nodes connectDragId mousePosition ] else connections)
      ]

    , div

      (
        [ id "node-graph"
        , (Mouse.onWithOptions "mousedown" { stopPropagation = False, preventDefault = False } startViewMove) -- do not prevent input blur on click
        , Wheel.onWheel (\event -> UpdateView (MagnifyView
          { amount = (if event.deltaY < 0 then 1 else -1)
          , focus = (Vec2.fromTuple event.mouseEvent.clientPos)
          }))
        , preventContextMenu (always DoNothing)
        ]
      )

      [ div [ class "transform-wrapper", magnifyAndOffsetHTML model.view ]
        (List.map .node nodeViews)
      ]

    , div [ id "overlay" ]
      [ nav []
        [ header []
          [ img [ src "html/img/logo.svg" ] []
          , h1 [] [ text "Regex Nodes" ]
          , a
            [ href "https://github.com/johannesvollmer/regex-nodes", target "_blank", rel "noopener noreferrer"
            , title "github.com/regex-nodes"
            ]
            [ text "by johannes vollmer" ]
          ]

        , div [ id "example-options" ]
          [ div
            [ id "match-limit"
            , title ("Display no more than " ++ String.fromInt model.exampleText.maxMatches
              ++ " Matches from the example text, in order to perserve responsivenes"
              )
            ]
            [ text "Example Match Limit"
            , viewPositiveIntInput model.exampleText.maxMatches (UpdateExampleText << UpdateMaxMatchLimit)
            ]

          , div
            [ id "edit-example", class "button"
            , checked model.exampleText.isEditing
            , Mouse.onClick (always <| UpdateExampleText <| SetEditing <| not model.exampleText.isEditing)
            , title "Edit the Text which is displayed in the background"
            ]

            [ text "Edit Example" ]
          ]
        ]

      , div [ id "search" ]
        [ viewSearchBar model.search
        , viewSearchResults model.search
        ]

      , div [ id "expression-result", classes "" [(expressionResult == Nothing, "no")] ]
        [ code []
          [ span [ id "declaration" ] [ text "const regex = " ]
          , text (expressionResult |> Maybe.withDefault (Ok "/(nothing)/") |> unwrapResult)
          ]

        , div
          [ id "lock", classes "button" [(model.outputNode.locked, "checked")]
          , Mouse.onClick (always <| SetOutputLocked <| not model.outputNode.locked)
          , title "Always show the regex of the selected Node"
          ]
          [ lockSvg ]
        ]
      ]

    , div
      [ id "confirm-deletion"
      , classes "alert" [(model.confirmDeletion /= Nothing, "show")]
      , Mouse.onClick <| always <| ConfirmDeleteNode False
      , stopMousePropagation "wheel"
      ]

      [ div [ class "dialog-box" ]
        [ p [] [ text ("Delete that node?") ]
        , div [ class "options" ]
          [ div
            [ class "confirm", class "button"
            , onMouseWithStopPropagation "click" (always <| ConfirmDeleteNode True)
            ]
            [ text "Delete" ]

          , div [ class "cancel", class "button" ] [ text "Cancel" ]
          ]

        ]
      ]

    , div
      [ id "cycles-detected"
      , classes "notification button" [(model.cyclesError, "show")]
      , Mouse.onClick <| always <| DismissCyclesError
      ]

      [ text ("Some actions cannot be performed due to cycles in the node graph.")
      , div [] [ text ("Make sure there are no cyclic connections. Click to dismiss.") ]
      ]
    ]


unwrapResult result = case result of
  Ok a -> a
  Err a -> a

lockSvg =
  Svg.svg
    [ Svg.Attributes.width "50", Svg.Attributes.height "50", Svg.Attributes.viewBox "0 0 10 10" ]
    [ Svg.path [ Svg.Attributes.id "bracket", Svg.Attributes.d "M 3,3 v -1.5 c 0,-2 4,-2 4,0 v 4" ] []
    , Svg.rect
      [ Svg.Attributes.x "2", Svg.Attributes.y "5"
      , Svg.Attributes.width "6", Svg.Attributes.height "4"
      , Svg.Attributes.id "body"
      ] [ ]
    ]

preventContextMenu handler = Mouse.onWithOptions "contextmenu"
  { preventDefault = True, stopPropagation = False }
  handler

conservativeOnMouse tag handler = Mouse.onWithOptions tag
  { preventDefault = False, stopPropagation = False }
  handler

viewSearchResults search =
  div
    [ id "results"
    , stopMousePropagation "wheel"
    ]
    (Maybe.withDefault [] (Maybe.map viewSearch search) )

viewSearchBar search = input
  [ placeholder (if search == Nothing then "Add Nodes" else "Search Nodes  or  Enter A Regular Expression")
  , type_ "text"
  , value (Maybe.withDefault "" search)
  , onFocus (SearchMessage (UpdateSearch ""))
  , onInput (\text -> SearchMessage (UpdateSearch text)) -- TODO if enter, submit first
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

    render prototype = div
      [ class "button"
      , Mouse.onWithOptions
        "mousedown"
        { stopPropagation = False, preventDefault = False } -- do not prevent blurring the textbox on selecting a result
        (\_ -> SearchMessage (FinishSearch (InsertPrototype prototype.node)))
      ]

      [ p [ class "name" ] [ text prototype.name ]
      , p [ class "description" ] [ text prototype.description ]
      ]

    asRegex = div
      [ class "button"
      , Mouse.onWithOptions
        "mousedown"
        { stopPropagation = False, preventDefault = False } -- do not prevent blurring the textbox on selecting a result
        (\_ -> SearchMessage (FinishSearch (ParseRegex query)))
      ]
      [ text "Insert "
      , span [ id "parse-regex" ] [ text query ]
      , text " as Nodes"
      , p [ class "description" ] [ text "Add the regular expression by converting it to a network of Nodes" ]
      ]

    results = (prototypes |> List.filter matches |> List.map render)

  in prependListIf (not isEmpty) asRegex results


viewExampleText example =
  if example.isEditing
    then textarea [ id "example-text", onInput (UpdateExampleText << UpdateContents) ]
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


viewNode : Maybe DragMode -> Maybe NodeId -> Maybe NodeId -> Nodes -> (NodeId, Model.NodeView) -> NodeView
viewNode dragMode selectedNode outputNode nodes (nodeId, nodeView) =
  let props = nodeProperties nodeView.node in
  NodeView (viewNodeContent dragMode selectedNode outputNode nodeId props nodeView) (viewNodeConnections nodes props nodeView)


viewNodeConnections : Nodes -> List Property -> Model.NodeView -> List (Svg Message)
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
        supplier = IdMap.get supplierId nodes
        viewSupplier supplierNodeView =
          connectionLine supplierNodeView.position (nodeWidth supplierNodeView.node) node.position index

      in Maybe.map viewSupplier supplier

    viewInputConnection : Property -> List (Int -> Maybe (Svg Message))
    viewInputConnection property = case property.contents of
        ConnectingProperty (Just supplier) _ ->
          [ connect supplier nodeView ]

        ConnectingProperties _ suppliers _ ->
          suppliers |> Array.toList |> List.map (\supplier -> connect supplier nodeView)

        _ ->  [ always Nothing ]

    -- TODO use lazy html!
    flattened = props |> List.map viewInputConnection |> flattenList
    indexed = flattened |> List.indexedMap (\index at -> at index)
    filtered = List.filterMap identity indexed

  in filtered


viewConnectDrag : View -> Nodes -> Maybe NodeId -> Vec2 -> Html Message
viewConnectDrag viewTransformation nodes dragId mouse =
  let
    node = Maybe.andThen (\id -> IdMap.get id nodes) dragId
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

-- TODO use lazy html!
viewNodeContent : Maybe DragMode -> Maybe NodeId -> Maybe NodeId -> NodeId -> List Property -> Model.NodeView -> Html Message
viewNodeContent dragMode selectedNode outputNode nodeId props nodeView =
  let
    contentWidth = (nodeWidth nodeView.node |> String.fromFloat) ++ "px"

    mayDragConnect = case dragMode of
      Just (PrepareEditingConnection { node }) -> nodeId == node
      Just (RetainPrototypedConnection { node }) -> nodeId == node
      _ -> False

    -- equivalent to on right mouse down on MacOS
    onContextMenu event =
      if dragMode == Nothing then -- only do that on MacOs (windows mouse up will fail this check)
        DragModeMessage (StartPrepareEditingConnection { node = nodeId, mouse = Vec2.fromTuple event.clientPos })

      else DoNothing

    onMouseDownAndStopPropagation event =
      if event.button == Mouse.SecondButton then
        { message = DragModeMessage (StartPrepareEditingConnection { node = nodeId, mouse = Vec2.fromTuple event.clientPos })
        , stopPropagation = True
        , preventDefault = True
        }

      else if event.button == Mouse.MainButton then
        { message = DragModeMessage (StartNodeMove { node = nodeId, mouse = Vec2.fromTuple event.clientPos })
        , stopPropagation = True
        , preventDefault = True
        }

      -- do not stop event propagation on middle mouse down
      else { message = DoNothing, stopPropagation = False, preventDefault = False }

    -- TODO dry

    duplicateAndStopPropagation event =
      if event.button == Mouse.MainButton
      then (DuplicateNode nodeId, True)
      else (DoNothing, False) -- do not stop event propagation on non-primary mouse down

    deleteAndStopPropagation event =
      if event.button == Mouse.MainButton
      then (DeleteNode nodeId, True)
      else (DoNothing, False) -- do not stop event propagation on non-primary mouse down

    mayStopPropagation : String -> (Mouse.Event -> (Message, Bool)) -> Attribute Message
    mayStopPropagation tag handler = Html.Events.stopPropagationOn
      tag (Mouse.eventDecoder |> Json.Decode.map handler)


    preventDefaultAndMayStopPropagation : String ->
      (Mouse.Event -> { message: Message, preventDefault: Bool, stopPropagation: Bool })
        -> Attribute Message

    preventDefaultAndMayStopPropagation tag handler = Html.Events.custom
      tag (Mouse.eventDecoder |> Json.Decode.map handler)

  in div
    [ style "width" contentWidth
    , translateHTML nodeView.position
    , classes "graph-node"
      [ (hasDragConnectionPrototype dragMode nodeId, "connecting")
      , (outputNode == Just nodeId, "output")
      , (selectedNode == Just nodeId, "selected")
      , (mayDragConnect, "may-drag-connect")
      ]
    ]

    [ div
      [ class "properties"
      , preventDefaultAndMayStopPropagation "mousedown" onMouseDownAndStopPropagation -- always prevent default (to prevent native drag)?
      , preventContextMenu onContextMenu
      ]
      (viewProperties nodeId dragMode props)

    , div
      [ class "menu" ]
      [ div
          [ mayStopPropagation "mousedown" duplicateAndStopPropagation -- must be mousedown because click would be triggered after deselect on mouse down
          , class "duplicate button"
          , title "Duplicate this Node"
          ]
          [ img [ src "html/img/copy.svg" ] [] ]

      , div
          [ mayStopPropagation "mousedown" deleteAndStopPropagation -- must be mousedown because click would be triggered after deselect on mouse down
          , class "delete button"
          , title "Delete this Node"
          ]
          [ img [ src "html/img/bin.svg" ] [] ]

      ]

    ]


viewProperties : NodeId -> Maybe DragMode -> List Property -> List (Html Message)
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


    propertyHTML: List (Attribute Message) -> Html Message -> String -> String -> Bool -> Html Message -> Html Message -> Html Message
    propertyHTML attributes directInput name description connectableInput left right = div
      ((classes "property" [(connectableInput, "connectable-input")]) :: (title description :: attributes))

      [ left
      , span [ class "title" ] [ text name ]
      , directInput
      , right
      ]

    updateNode = UpdateNodeMessage nodeId

    simpleInputProperty property directInput = propertyHTML
      [ Mouse.onLeave (onLeave Nothing property.connectOutput) ] directInput property.name property.description False (leftConnector False) (rightConnector property.connectOutput)

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

      in propertyHTML (onEnter ++ onLeaveHandlers) (div[][]) property.name property.description True left (rightConnector property.connectOutput)

    singleProperty property = case property.contents of
      BoolProperty value onChange -> [ simpleInputProperty property (viewBoolInput value (onChange (not value) |> updateNode)) ]
      CharsProperty chars onChange -> [ simpleInputProperty property (viewCharsInput chars (onChange >> updateNode)) ]
      CharProperty char onChange -> [ simpleInputProperty property (viewCharInput char (onChange >> updateNode)) ]
      IntProperty number onChange -> [ simpleInputProperty property (viewPositiveIntInput number (onChange >> updateNode)) ]
      ConnectingProperty currentSupplier onChange -> [ connectInputProperty property currentSupplier onChange ]

      ConnectingProperties countThem connectedProps onChange ->
        let
          count index prop = if countThem
            then { prop | name = prop.name ++ " " ++ String.fromInt (index + 1) }
            else prop

          onChangePropertyAtIndex index newInput = case newInput of
             Just newInputId -> onChange (Array.set index newInputId connectedProps)
             Nothing -> onChange (removeFromArray index connectedProps)

          onChangeStubProperty newInput = case newInput of
            Just newInputId -> onChange (Array.push newInputId connectedProps)
            Nothing -> onChange (removeFromArray ((Array.length connectedProps) - 1) connectedProps)

          realProperties = Array.toList <| Array.indexedMap
            (\index currentSupplier -> connectInputProperty (count index property) (Just currentSupplier) (onChangePropertyAtIndex index))
            connectedProps

          propCount = Array.length connectedProps
          stubProperty = connectInputProperty (count propCount property) Nothing onChangeStubProperty
        in realProperties ++ [ stubProperty ]


      TitleProperty ->
        [ propertyHTML
            [ Mouse.onLeave (onLeave Nothing True) ]
            (div[][])
            property.name property.description
            False
            (leftConnector False) (rightConnector property.connectOutput)
        ]

  in
    flattenList (List.map singleProperty props)


onMouseWithStopPropagation eventName eventHandler = Mouse.onWithOptions
  eventName { preventDefault = False, stopPropagation = True } eventHandler

stopMousePropagation eventName =
  onMouseWithStopPropagation eventName (always DoNothing)

viewBoolInput : Bool -> Message -> Html Message
viewBoolInput value onToggle = input
  [ type_ "checkbox"
  , checked value
  , onMouseWithStopPropagation "click" (always onToggle)
  , stopMousePropagation "mousedown"
  , stopMousePropagation "mouseup"
  ]
  []


viewCharsInput : String -> (String -> Message) -> Html Message
viewCharsInput chars onChange = input
  [ type_ "text"
  , placeholder "AEIOU"
  , value (insertWhitePlaceholder chars)-- FIXME this will reset the cursor position
  , onInput (removeWhitePlaceholder >> onChange)
  , class "chars input"
  , stopMousePropagation "mousedown"
  , stopMousePropagation "mouseup"
  ]
  []

viewCharInput : Char -> (Char -> Message) -> Html Message
viewCharInput char onChange = input
  [ type_ "text"
  , placeholder "a"
  , value (String.fromChar char |> insertWhitePlaceholder) -- FIXME this will reset the cursor position

  -- Take the last char of the string
  , onInput (onChange << stringToChar char << removeWhitePlaceholder)

  , class "char input"
  , stopMousePropagation "mousedown"
  , stopMousePropagation "mouseup"
  ]
  []


viewPositiveIntInput : Int -> (Int -> Message) -> Html Message
viewPositiveIntInput number onChange = input
  [ type_ "number"
  , value (String.fromInt number)
  , onInput (onChange << stringToInt number)
  , class "int input"
  , stopMousePropagation "mousedown"
  , stopMousePropagation "mouseup"
  , Html.Attributes.min "0"
  ]
  []


stringToInt fallback string = string
  |> String.toInt |> Maybe.withDefault fallback

stringToChar fallback string = string
  |> String.right 1 |> String.uncons
  |> Maybe.map Tuple.first |> Maybe.withDefault fallback


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

