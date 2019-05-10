module Update exposing (..)

import Model exposing (..)
import Build exposing (buildRegex, compileRegex)
import Dict exposing (Dict)
import Vec2 exposing (Vec2)
import Parse exposing (..)
import Regex



-- UPDATE

type Message
  = SearchMessage SearchMessage
  | DragModeMessage DragModeMessage
  | UpdateNodeMessage NodeId Node
  | UpdateView ViewMessage
  | UpdateExampleText String
  | SetEditingExampleText Bool

type SearchMessage
  = UpdateSearch String
  | FinishSearch SearchResult

type SearchResult
  = InsertPrototype NodeView
  | ParseRegex String
  | NoResult

type ViewMessage
  = MagnifyView { amount: Float, focus: Vec2 }

type DragModeMessage
  = StartNodeMove { node : NodeId, mouse : Vec2 }

  | StartPrepareEditingConnection { node: NodeId, mouse: Vec2 }
  | StartEditingConnection { nodeId: NodeId, node: Node, supplier: Maybe NodeId, mouse: Vec2 }
  | StartCreateConnection { supplier: NodeId, mouse: Vec2 }
  | RealizeConnection { nodeId: NodeId, newNode: Node, mouse: Vec2 }
  | FinishDrag

  | UpdateDrag { newMouse : Vec2 }


update : Message -> Model -> Model
update message model =
  case message of
    UpdateExampleText text -> let old = model.exampleText in
      { model | exampleText = { old | contents = text } }

    SetEditingExampleText enabled ->
      if not enabled
        then updateCache (enableEditingExampleText model enabled)
        else enableEditingExampleText model enabled

    UpdateView viewMessage ->
      if model.exampleText.isEditing
        || Dict.isEmpty model.nodes.values
      then model

      else case viewMessage of
          MagnifyView { amount, focus } ->
            { model | view = updateView amount focus model.view }

    UpdateNodeMessage id value ->
      updateCache { model | nodes = updateNode model.nodes id value }

    SearchMessage searchMessage ->
      case searchMessage of
        UpdateSearch query -> { model | search = Just query }
        FinishSearch result -> stopEditingExampleText
          (case result of
            InsertPrototype prototype -> { model | nodes = addNode model.nodes prototype, search = Nothing }
            ParseRegex regex -> { model | search = Nothing, nodes = addParsedRegexNode model.nodes regex }
            NoResult -> { model | search = Nothing }
          )

    DragModeMessage modeMessage ->
      case modeMessage of
        StartNodeMove { node, mouse } ->
          let
            newModel = { model
              | result = Just node,
              dragMode = Just (MoveNodeDrag { node = node, mouse = mouse })
              }

          in if model.result /= newModel.result
            -- only update cache if node really changed
            then updateCache newModel else newModel


        -- update the subject node (disconnecting the input)
        -- and then start editing the connection of the old supplier
        -- TODO if current drag mode is retain, then reconnect to old node?
        StartEditingConnection { nodeId, node, supplier, mouse } ->
          Maybe.withDefault model <| Maybe.map
            (\oldSupplier ->
              updateCache { model | nodes = updateNode model.nodes nodeId node
              , dragMode = Just (CreateConnection { supplier = oldSupplier, openEnd = mouse })
              }
            )
            supplier


        StartCreateConnection { supplier, mouse } ->
          { model | dragMode = Just (CreateConnection { supplier = supplier, openEnd = mouse }) }

        StartPrepareEditingConnection { node, mouse } ->
          { model | dragMode = Just (PrepareEditingConnection { node = node, mouse = mouse }) }

        UpdateDrag { newMouse } ->
          case model.dragMode of
            Just (MoveNodeDrag { node, mouse }) ->
              let delta = Vec2.sub newMouse mouse in
              { model | nodes = moveNode model.view model.nodes node delta
              , dragMode = Just (MoveNodeDrag { node = node, mouse = newMouse })
              }

            Just (CreateConnection { supplier }) ->
              let mode = CreateConnection { supplier = supplier, openEnd = newMouse } in
              { model | dragMode = Just mode }

            _ -> model

        -- when a connection is established, update the drag mode of the model,
        -- but also already make the connection real
        RealizeConnection { nodeId, newNode, mouse } ->
          updateCache { model | nodes = updateNode model.nodes nodeId newNode
          , dragMode = Just (RetainPrototypedConnection { mouse = mouse, node = nodeId, previousNodeValue = Dict.get nodeId model.nodes.values |> Maybe.map .node })
          }

        FinishDrag ->
          { model | dragMode = Nothing }



stopEditingExampleText model =
  enableEditingExampleText model False

enableEditingExampleText model enabled =
  let old = model.exampleText in
  { model | exampleText = { old | isEditing = enabled } }

addNode : Nodes -> NodeView -> Nodes
addNode nodes node =
  { values = Dict.insert nodes.nextId node nodes.values
  , nextId = nodes.nextId + 1
  }

updateNode : Nodes -> NodeId -> Node -> Nodes
updateNode nodes id newNode =
  let updateNodeContents nodeview = Maybe.map (\n -> { n | node = newNode }) nodeview
  in { nodes | values = Dict.update id updateNodeContents nodes.values }


moveNode : View -> Nodes -> NodeId -> Vec2 -> Nodes
moveNode view nodes nodeId movement =
  let
    transform = viewTransform view
    viewMovement = Vec2.scale (1 / transform.scale) movement
    updateNodePosition node = Maybe.map (\n -> { n | position = Vec2.add n.position viewMovement }) node
  in { nodes | values = Dict.update nodeId updateNodePosition nodes.values }


updateView amount focus oldView =
  let
    magnification = oldView.magnification + amount
    transform = viewTransform { magnification = magnification, offset = oldView.offset }

    oldTransform = viewTransform oldView
    deltaScale = transform.scale / oldTransform.scale

    newView = if transform.scale < 0.1 || transform.scale > 16 then oldView else
      { magnification = magnification
      , offset =
        { x = (oldView.offset.x - focus.x) * deltaScale + focus.x
        , y = (oldView.offset.y - focus.y) * deltaScale + focus.y
        }
      }

  in newView



updateCache model =
  let
    example = model.exampleText
    regex = model.result |> Maybe.map (buildRegex model.nodes)

    multiple = regex |> Maybe.map
      (Result.map (.flags >> .multiple) >> Result.withDefault False)
      |> Maybe.withDefault False

    compiled = regex |> Maybe.andThen (Result.map compileRegex >> Result.map Just >> Result.withDefault Nothing)
    newExample = { example | cachedMatches = Maybe.map (extractMatches multiple example.maxMatches example.contents) compiled }

  in { model | exampleText = newExample }


extractMatches : Bool -> Int -> String -> Regex.Regex -> List (String, String)
extractMatches multiple maxMatches text regex =
  let
    matches = Regex.findAtMost (if multiple then maxMatches else 1) regex text

    extractMatch match (textStartIndex, extractedMatches) =
      let
        textBeforeMatch = String.slice textStartIndex match.index text
        indexAfterMatch = match.index + String.length match.match
      in (indexAfterMatch, extractedMatches ++ [(textBeforeMatch, match.match)])

    extract rawMatches =
      let (indexAfterLastMatch, extractedMatches) = List.foldl extractMatch (0, []) rawMatches -- use foldr in order to utilize various optimizations

      in if List.length matches == maxMatches
        -- do not append unprocessed text
        -- (if maximum matches were processed, any text after the last match has not been processed)
        then extractedMatches

        -- else, also add all the text after the last match
        else extractedMatches ++ [(String.slice indexAfterLastMatch (String.length text) text, "")]


    simplify = List.foldr simplifyMatch []

    simplifyMatch (before, match) alreadySimplified = case alreadySimplified of
        -- if text between this and successor match is empty, merge them into a single match
        ("", immediateSuccessor) :: moreRest -> (before, match ++ immediateSuccessor) :: moreRest

         -- just append otherwise
        other -> (before, match) :: other


    -- replace spaces by (hair-space ++ dot ++ hair-space) to visualize whitespace
    -- (separate function to avoid recursion stack overflow)
    visualizeMatch match = String.replace " " "\u{200A}·\u{200A}" match
    visualize matchList = List.map (Tuple.mapSecond visualizeMatch) matchList

  in matches |> extract |> simplify |> visualize


updateFollowedByExpression followed expression = IfFollowedByNode { followed | expression = expression }
updateFollowedBySuccessor followed successor = IfFollowedByNode { followed | successor = successor }

updateNotFollowedByExpression followed expression = IfNotFollowedByNode { followed | expression = expression }
updateNotFollowedBySuccessor followed successor = IfNotFollowedByNode { followed | successor = successor }

updateCharRangeFirst end maybeStart = maybeStart |> Maybe.withDefault 'a' |> (\s -> CharRangeNode s (maxChar s end))
updateCharRangeLast start maybeEnd = maybeEnd |> Maybe.withDefault 'z' |> (\e -> CharRangeNode (minChar e start) e)

updateNotInCharRangeFirst end maybeStart = maybeStart |> Maybe.withDefault 'a' |> (\s -> NotInCharRangeNode s (maxChar s end))
updateNotInCharRangeLast start maybeEnd = maybeEnd |> Maybe.withDefault 'z' |> (\e -> NotInCharRangeNode (minChar e start) e)

updateExactRepetitionExpression repetition expression = ExactRepetitionNode { repetition | expression = expression }
updateExactRepetitionCount repetition count = ExactRepetitionNode { repetition | count = count }

updateMinimumRepetitionExpression repetition expression = MinimumRepetitionNode { repetition | expression = expression }
updateMinimumRepetitionCount repetition count = MinimumRepetitionNode { repetition | minimum = count }

updateMaximumRepetitionExpression repetition expression = MaximumRepetitionNode { repetition | expression = expression }
updateMaximumRepetitionCount repetition count = MaximumRepetitionNode { repetition | maximum = count }

updateRangedRepetitionExpression repetition expression = RangedRepetitionNode { repetition | expression = expression }
updateRangedRepetitionMinimum repetition count = RangedRepetitionNode { repetition | minimum = count, maximum = max count repetition.maximum }
updateRangedRepetitionMaximum repetition count = RangedRepetitionNode { repetition | maximum = count, minimum = min count repetition.minimum }

updateFlagsExpression flags newInput = FlagsNode { flags | expression = newInput }
updateFlags expression newFlags = FlagsNode { expression = expression, flags = newFlags }
updateFlagsMultiple { expression, flags } multiple = updateFlags expression { flags | multiple = multiple }
updateFlagsInsensitivity { expression, flags } caseSensitive = updateFlags expression { flags | caseSensitive = caseSensitive }
updateFlagsMultiline { expression, flags } multiline = updateFlags expression { flags | multiline = multiline }

minChar a b =
  if a < b
    then a else b

maxChar a b =
  if a > b
    then a else b
