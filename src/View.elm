module View exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onBlur, onFocus)
import Dict exposing (Dict)
import Html.Events.Extra.Mouse as Mouse
import Regex

import Vec2 exposing (Vec2)
import Model exposing (..)
import Build exposing (..)
import Update exposing (..)


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
        (\_ -> SearchMessage (FinishSearch (InsertPrototype (NodeView position prototype.node))))
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



viewNode : (NodeId, NodeView) -> Html Message
viewNode (nodeId, node) = case node.node of
  Whitespace -> viewNodeWithProperties nodeId node.position 160 viewWhitespaceProperties
  CharSet chars -> viewNodeWithProperties nodeId node.position 170 (viewCharSetProperties nodeId chars)
  Optional option -> viewNodeWithProperties nodeId node.position 100 (viewOptionalProperties option)
  Set options -> viewNodeWithProperties nodeId node.position 80 (viewSetProperties options)
  Flags flags -> viewNodeWithProperties nodeId node.position 140 (viewFlagsProperties nodeId flags)
  _ -> viewNodeWithProperties nodeId node.position 80 [viewInputProperty "Unimplemented" noInputView False]

viewNodeWithProperties nodeId position width properties =  div
  [ Mouse.onDown (\event -> DragModeMessage (StartNodeMove { node = nodeId, mouse = Vec2.fromTuple event.clientPos }))
  , class "graph-node"
  , style "width" ((String.fromFloat width) ++ "px")
  , translateHTML position
  ]

  properties

noInputView = div[][]

viewWhitespaceProperties : List (Html Message)
viewWhitespaceProperties = [ viewConstantProperty typeNames.whitespace ]

viewCharSetProperties : NodeId -> String -> List (Html Message)
viewCharSetProperties self chars = [ viewCharsProperty typeNames.charset chars (\newChars -> UpdateNodeMessage self (CharSet newChars)) True ]

viewOptionalProperties : Maybe NodeId -> List (Html Message)
viewOptionalProperties option = [ viewConnectProperty typeNames.optional True ]

viewSetProperties : List NodeId -> List (Html Message)
viewSetProperties options =
  [ viewTitleProperty typeNames.set ]
  ++ viewAutoListProperties "Option" options

viewFlagsProperties : NodeId -> { expression : Maybe NodeId, flags : RegexFlags } -> List (Html Message)
viewFlagsProperties self { expression, flags } =
  let setFlags newFlags = UpdateNodeMessage self (Flags { expression = expression, flags = newFlags }) in

  [ viewConnectProperty typeNames.flags False

  , viewBoolProperty
      "Multiple Matches" flags.multiple
      (setFlags { flags | multiple = not flags.multiple })
      False

  , viewBoolProperty
      "Case Sensitive" flags.caseSensitive
      (setFlags { flags | caseSensitive = not flags.caseSensitive })
      False

  , viewBoolProperty
      "Multiline Matches" flags.multiline
      (setFlags { flags | multiline = not flags.multiline })
      False
  ]


viewAutoListProperties : String -> List NodeId -> List (Html Message)
viewAutoListProperties name connectedNodes =
  let
    connected = List.map
      (\_ -> viewConnectProperty name False)
      connectedNodes
  in
    connected ++ [ viewConnectProperty name False ]



viewTitleProperty : String -> Html Message
viewTitleProperty name = viewInputProperty name noInputView True

viewConstantProperty : String -> Html Message
viewConstantProperty name = viewConnectProperty name True

viewBoolProperty : String -> Bool -> Message -> Bool -> Html Message
viewBoolProperty name value onChange isOutput =
  viewInputProperty name (viewBoolInput value onChange) isOutput

viewBoolInput : Bool -> Message -> Html Message
viewBoolInput value onToggle = input
  [ type_ "checkbox"
  , checked value
  , Mouse.onClick (\_ -> onToggle)
  ]
  []


viewCharsProperty : String -> String -> (String -> Message) -> Bool -> Html Message
viewCharsProperty name value onChange isOutput =
  viewInputProperty name (viewCharsInput value onChange) isOutput

viewCharsInput : String -> (String -> Message) -> Html Message
viewCharsInput chars onChange = input
  [ type_ "text"
  , placeholder "!?:;aeiou"
  , value chars
  , onInput onChange
  , class "chars input"
  ]
  []


-- property whose input cannot be connected
viewInputProperty : String -> Html Message -> Bool -> Html Message -- : { name : String, isOutput : Bool, input : InputView } -> Html Message
viewInputProperty name inputView connectOutput = div
  [ class (prependStringIf connectOutput "main " "property") ]

  [ div [ class "inactive left connector" ] []
  , span [ class "title" ] [ text name ]
  , inputView
  , div [ class (prependStringIf (not connectOutput) "inactive " "right connector" ) ] []
  ]

-- property whose input can be connected
viewConnectProperty : String -> Bool -> Html Message -- : { name : String, isOutput : Bool, input : InputView } -> Html Message
viewConnectProperty name connectOutput = div
  [ class (prependStringIf connectOutput "main " "property") ]

  [ div [ class "left connector" ] []
  , span [ class "title" ] [ text name ]
  , div [ class (prependStringIf (not connectOutput) "inactive " "right connector") ] []
  ]




prependListIf: Bool -> a -> List a -> List a
prependListIf condition element list =
    if condition then element :: list else list

prependStringIf: Bool -> String -> String -> String
prependStringIf condition conditional existing =
    if condition then conditional ++ existing else existing


translateHTML = translate "px"
translateSVG = translate ""
translate unit position = style "transform" ("translate(" ++ (String.fromFloat position.x) ++ unit ++ "," ++ (String.fromFloat position.y) ++ unit ++ ")")

