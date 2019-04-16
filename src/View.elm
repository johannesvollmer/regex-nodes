module View exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onBlur, onFocus)
import Dict exposing (Dict)
import Html.Events.Extra.Mouse as Mouse
import Svg exposing (Svg, svg, line)
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

type alias OnChange a = a -> Message

type PropertyViewContents
  = BoolProperty Bool (OnChange Bool)
  | CharsProperty String (OnChange String)
  | CharProperty Char (OnChange (Maybe Char))
  | IntProperty Int (OnChange Int)
  | ConnectingProperty (Maybe NodeId) (OnChange (Maybe NodeId))
  | ConnectingProperties (List NodeId) (OnChange (List NodeId))
  | TitleProperty

type alias NodeView =
  { node: Html Message
  , connections: List (Svg Message)
  }

properties : NodeId -> Node -> List PropertyView
properties nodeId node =
  case node of
    Whitespace -> [ PropertyView typeNames.whitespace TitleProperty True ]
    CharSet chars -> [ PropertyView typeNames.charset (CharsProperty chars (updateCharSetChars nodeId)) True ]
    Optional option -> [ PropertyView typeNames.optional (ConnectingProperty option (updateOptionalOption nodeId)) True ]

    Set options ->
      [ PropertyView typeNames.set TitleProperty True
      , PropertyView "Option" (ConnectingProperties options (updateSetOptions nodeId)) False
      ]

    Flags flagsNode ->
      [ PropertyView typeNames.flags (ConnectingProperty flagsNode.expression (updateFlagsExpression nodeId flagsNode)) True
      , PropertyView "Multiple Matches" (BoolProperty flagsNode.flags.multiple (updateFlagsMultiple nodeId flagsNode)) False
      , PropertyView "Case Insensitive" (BoolProperty flagsNode.flags.caseSensitive (updateFlagsInsensitivity nodeId flagsNode)) False
      , PropertyView "Multiline Matches" (BoolProperty flagsNode.flags.multiline (updateFlagsMultiline nodeId flagsNode)) False
      ]

    Repeated repetition ->
      [ PropertyView typeNames.repeated (ConnectingProperty repetition.expression (updateRepetitionExpression nodeId repetition)) True
      , PropertyView "Multiline Matches" (IntProperty repetition.count (updateRepetitionCount nodeId repetition)) False
      ]


    IfFollowedBy followed ->
      [ PropertyView typeNames.ifFollowedBy (ConnectingProperty followed.expression (updateFollowedByExpression nodeId followed)) True
      , PropertyView "Successor" (ConnectingProperty followed.successor (updateFollowedBySuccessor nodeId followed)) False
      ]





-- VIEW

view : Model -> Html Message
view model =
  let
    expressionResult = Maybe.map
      (\id -> buildRegex model.nodes id |> constructRegexLiteral)
      model.result

    nodeViews = (List.map (viewNode model.nodes) (Dict.toList model.nodes.values))

  in div
    [ Mouse.onMove (\event -> DragModeMessage (UpdateDrag { newMouse = Vec2.fromTuple event.clientPos }))
    , Mouse.onUp (\_ -> DragModeMessage FinishDrag)
    , Mouse.onLeave (\_ -> DragModeMessage FinishDrag)
    , id "main"
    ]

    [ div [ id "connection-graph" ]
      [ svg [ id "transform-wrapper" ]
        (flattenList (List.map .connections nodeViews))
      ]

    , div [ id "node-graph" ]
      [ div [ id "transform-wrapper" ]
        (List.map .node nodeViews)
      ]

    , div [ id "overlay" ]
      [ nav [ ]
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
viewNode : Nodes -> (NodeId, Model.NodeView) -> NodeView
viewNode nodes (nodeId, nodeView) =
  let props = properties nodeId nodeView.node in
  NodeView (viewNodeContent nodeId props nodeView) (viewNodeConnections nodes props nodeView)


viewNodeConnections : Nodes -> List PropertyView -> Model.NodeView -> List (Svg Message)
viewNodeConnections nodes props nodeView =
  let
    toConnections (index, property) connections = case property.contents of
      ConnectingProperty id _ -> Maybe.map (\i -> (index, i) :: connections) id |> Maybe.withDefault connections

      -- FIXME needs to increment index actually, not the same index every property!
      ConnectingProperties ids _ -> List.map (Tuple.pair index) ids ++ connections
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
          , x2 (String.fromFloat (node |> Maybe.map (\nd -> nd.position.x + nodeWidth nd.node) |> Maybe.withDefault 0))
          , y2 (String.fromFloat ((node |> Maybe.map (.position >> .y) |> Maybe.withDefault 0) + 0.5 * 25))
          ]
          []
      )
      filtered


viewNodeContent : NodeId -> List PropertyView -> Model.NodeView -> Html Message
viewNodeContent nodeId props nodeView =  div
  [ Mouse.onDown (\event -> DragModeMessage (StartNodeMove { node = nodeId, mouse = Vec2.fromTuple event.clientPos }))
  , class "graph-node"
  , style "width" ((String.fromFloat (nodeWidth nodeView.node)) ++ "px")
  , translateHTML nodeView.position
  ]

  (viewProperties props)

nodeWidth node = case node of
  Whitespace -> 160
  CharSet _ -> 170
  Optional _ -> 100
  Set _ -> 80
  Flags _ -> 140
  _ -> 80


viewProperties : List PropertyView -> List (Html Message)
viewProperties props =
  let
      viewSingleProperty : Bool -> PropertyView -> Html Message
      viewSingleProperty input property = div
          [ class (prependStringIf property.connectOutput "main " "property") ]

            [ div [ class (prependStringIf (not input) "inactive " "left connector") ] []
            , span [ class "title" ] [ text property.name ]

            , case property.contents of
                BoolProperty value onChange -> viewBoolInput value (onChange (not value))
                CharsProperty chars onChange -> viewCharsInput chars onChange
                CharProperty char onChange -> viewCharInput char onChange
                IntProperty number onChange -> viewIntInput number onChange
                ConnectingProperty _ onChange -> div [] [] -- TODO not instantiate a div
                ConnectingProperties _ onChange -> div [][] -- FIXME needs multiple names, not multiple inputs
                TitleProperty -> div [] [] -- TODO not instantiate a div

            , div [ class (prependStringIf (not property.connectOutput) "inactive " "right connector" ) ] []
          ]

      viewProperty : PropertyView -> List (Html Message)
      viewProperty prop = case prop.contents of
        ConnectingProperty _ onChange -> [ viewSingleProperty True prop ]
        ConnectingProperties inputs onChange -> (viewSingleProperty True prop) :: (List.map (\_ -> viewSingleProperty True prop) inputs)
        _ -> [ viewSingleProperty False prop ]




  in
    flattenList (List.map viewProperty props)





-- viewAutoListProperties name connectedNodes = connected ++ [ viewConnectProperty name False ]


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

prependStringIf: Bool -> String -> String -> String
prependStringIf condition conditional existing =
    if condition then conditional ++ existing else existing


translateHTML = translate "px"
translateSVG = translate ""
translate unit position = style "transform" ("translate(" ++ (String.fromFloat position.x) ++ unit ++ "," ++ (String.fromFloat position.y) ++ unit ++ ")")

