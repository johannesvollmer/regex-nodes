module Update exposing (..)

import Model exposing (..)
import Build exposing (buildRegex, compileRegex)
import Vec2 exposing (Vec2)
import Parse exposing (..)
import Regex
import IdMap exposing (IdMap)


-- UPDATE

type Message
  = SearchMessage SearchMessage
  | SetOutputLocked Bool
  | DragModeMessage DragModeMessage
  | UpdateNodeMessage NodeId Node
  | UpdateView ViewMessage
  | UpdateExampleText ExampleTextMessage
  | DeleteNode NodeId
  | ConfirmDeleteNode Bool
  | DuplicateNode NodeId
  | Deselect
  | DoNothing

type ExampleTextMessage
  = UpdateContents String
  | SetEditing Bool
  | UpdateMaxMatchLimit Int

type SearchMessage
  = UpdateSearch String
  | FinishSearch SearchResult

type SearchResult
  = InsertPrototype Node
  | ParseRegex String
  | NoResult

type ViewMessage
  = MagnifyView { amount: Float, focus: Vec2 }

type DragModeMessage
  = StartNodeMove { node : NodeId, mouse : Vec2 }
  | StartViewMove { mouse: Vec2 }

  | StartPrepareEditingConnection { node: NodeId, mouse: Vec2 }
  | StartEditingConnection { nodeId: NodeId, node: Node, supplier: Maybe NodeId, mouse: Vec2 }
  | StartCreateConnection { supplier: NodeId, mouse: Vec2 }
  | RealizeConnection { nodeId: NodeId, newNode: Node, mouse: Vec2 }
  | FinishDrag

  | UpdateDrag { newMouse : Vec2 }


update : Message -> Model -> Model
update message model =
  case message of
    DoNothing -> model
    Deselect -> if model.outputNode.locked
      then { model | selectedNode = Nothing }
      else updateCache { model | selectedNode = Nothing, outputNode = { locked = False, id = Nothing } }

    UpdateExampleText textMessage -> case textMessage of

      SetEditing enabled -> if not enabled
        -- update cache because text contents or match limit could have been changed
        then updateCache (enableEditingExampleText model enabled)
        else enableEditingExampleText model enabled

      UpdateContents text -> let old = model.exampleText in
        { model | exampleText = { old | contents = text } }

      UpdateMaxMatchLimit limit -> let old = model.exampleText in
        { model | exampleText = { old | maxMatches = limit } }


    UpdateView viewMessage ->
      if model.exampleText.isEditing
        || IdMap.isEmpty model.nodes
      then model

      else case viewMessage of
          MagnifyView { amount, focus } ->
            { model | view = updateView amount focus model.view }

    SetOutputLocked locked ->
      { model | outputNode = { id = model.outputNode.id, locked = locked } }

    UpdateNodeMessage id value ->
      updateCache { model | nodes = updateNode model.nodes id value }

    DuplicateNode id -> duplicateNode model id

    DeleteNode id -> { model | confirmDeletion = Just id }

    ConfirmDeleteNode delete -> if not delete
      then { model | confirmDeletion = Nothing }
      else deleteNode model

    SearchMessage searchMessage ->
      case searchMessage of
        UpdateSearch query -> { model | search = Just query }
        FinishSearch result -> case result of
          NoResult -> { model | search = Nothing }
          InsertPrototype prototype -> stopEditingExampleText (insertNode prototype model)
          ParseRegex regex -> stopEditingExampleText
            { model | search = Nothing, nodes = parseRegexNodes model.view model.nodes regex }

    DragModeMessage modeMessage ->
      case modeMessage of
        StartNodeMove { node, mouse } ->
          startNodeMove mouse node model

        StartViewMove drag ->
          { model | dragMode = Just <| MoveViewDrag drag }

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
              moveNodeInModel newMouse mouse node model

            Just (MoveViewDrag { mouse }) ->
              moveViewInModel newMouse mouse model

            Just (CreateConnection { supplier }) ->
              { model | dragMode = Just <| CreateConnection { supplier = supplier, openEnd = newMouse } }

            _ -> model

        -- when a connection is established, update the drag mode of the model,
        -- but also already make the connection real
        RealizeConnection { nodeId, newNode, mouse } ->
          updateCache { model | nodes = updateNode model.nodes nodeId newNode
          , dragMode = Just (RetainPrototypedConnection
              { mouse = mouse, node = nodeId, previousNodeValue = IdMap.get nodeId model.nodes |> Maybe.map .node })
          }

        FinishDrag ->
          { model | dragMode = Nothing }


deleteNode: Model -> Model
deleteNode model =
  let
    nodeId = model.confirmDeletion |> Maybe.withDefault -1
    output = if model.outputNode.id == model.confirmDeletion
      then Nothing else model.outputNode.id

    newNodeValues = model.nodes |> IdMap.remove nodeId
      |> IdMap.updateAll (\view -> { view | node = onNodeDeleted nodeId view.node })

  in updateCache { model
    | nodes = newNodeValues
    , outputNode = { id = output, locked = model.outputNode.locked }
    , confirmDeletion = Nothing
    , dragMode = Nothing
    }


duplicateNode: Model -> NodeId -> Model
duplicateNode model nodeId =
  let
    nodes = model.nodes
    node = IdMap.get nodeId nodes

  in case node of
      Nothing -> model
      Just original ->
        let
          position = Vec2.add original.position (Vec2 0 -28)
          clone = { original | position = position }

        in { model | nodes = IdMap.insert clone nodes }

insertNode node model =
    let position = Vec2.inverseTransform (Vec2 800 400) (viewTransform model.view)
    in { model | nodes = IdMap.insert (NodeView position node) model.nodes, search = Nothing }

parseRegexNodes view nodes regex =
    let position = Vec2.inverseTransform (Vec2 800 400) (viewTransform view)
    in addParsedRegexNodeOrNothing position nodes regex

startNodeMove mouse node model =
  let
    newModel =  { model
      | selectedNode = Just node
      , dragMode = Just (MoveNodeDrag { node = node, mouse = mouse })
      , outputNode = if not model.outputNode.locked || model.outputNode.id == Nothing
          then { id = Just node, locked = model.outputNode.locked }
          else model.outputNode
      }

  in if model.outputNode.id /= newModel.outputNode.id
    -- only update cache if node really changed
  then updateCache newModel else newModel

stopEditingExampleText model =
  enableEditingExampleText model False

enableEditingExampleText model enabled =
  let old = model.exampleText in
  { model | exampleText = { old | isEditing = enabled } }


updateNode : Nodes -> NodeId -> Node -> Nodes
updateNode nodes id newNode =
  nodes |> IdMap.update id (\nodeView -> { nodeView | node = newNode })


moveNodeInModel newMouse mouse node model =
  let delta = Vec2.sub newMouse mouse in
  { model | nodes = moveNode model.view model.nodes node delta
  , dragMode = Just (MoveNodeDrag { node = node, mouse = newMouse })
  }

moveViewInModel newMouse mouse model =
  let
    view = model.view
    delta = Vec2.sub newMouse mouse

  in { model | dragMode = Just <| MoveViewDrag { mouse = newMouse }
     , view = { view | offset = Vec2.add view.offset delta }
     }

moveNode : View -> Nodes -> NodeId -> Vec2 -> Nodes
moveNode view nodes nodeId movement =
  let
    transform = viewTransform view
    viewMovement = Vec2.scale (1 / transform.scale) movement
    updateNodePosition nodeView = { nodeView | position = Vec2.add nodeView.position viewMovement }
  in IdMap.update nodeId updateNodePosition nodes


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



updateCache : Model -> Model
updateCache model =
  let
    example = model.exampleText
    regex = model.outputNode.id |> Maybe.map (buildRegex model.nodes)

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
       -- use foldr in order to utilize various optimizations
      let (indexAfterLastMatch, extractedMatches) = List.foldl extractMatch (0, []) rawMatches

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



-- TOOD dry
cleanString = String.replace " " "␣"
updateExpression node expression = { node | expression = expression }
updateSuccessor node successor = { node | successor = successor }
updateStart node start = { node | start = start }
updateEnd node end = { node | end = end }
updateMinimal node minimal = { node | minimal = minimal }

updatePositiveCount node count = { node | count = positive count }

updateCharRangeFirst end start = CharRangeNode (minChar start end) (maxChar start end) -- swaps chars if necessary
updateCharRangeLast start end = CharRangeNode (minChar end start) (maxChar start end) -- swaps chars if necessary

updateNotInCharRangeFirst end start = CharRangeNode (minChar start end) (maxChar start end) -- swaps chars if necessary
updateNotInCharRangeLast start end = CharRangeNode (minChar end start) (maxChar start end) -- swaps chars if necessary

updateRangedRepetitionMinimum repetition count = RangedRepetitionNode
  { repetition | minimum = positive count, maximum = max (positive count) repetition.maximum }

updateRangedRepetitionMaximum repetition count = RangedRepetitionNode
  { repetition | maximum = positive count, minimum = min (positive count) repetition.minimum }

updateFlagsExpression flags newInput = FlagsNode { flags | expression = newInput }
updateFlags expression newFlags = FlagsNode { expression = expression, flags = newFlags }
updateFlagsMultiple { expression, flags } multiple = updateFlags expression { flags | multiple = multiple }
updateFlagsInsensitivity { expression, flags } caseSensitive = updateFlags expression { flags | caseSensitive = caseSensitive }
updateFlagsMultiline { expression, flags } multiline = updateFlags expression { flags | multiline = multiline }

positive = Basics.max 0
minChar a b = if a < b then a else b
maxChar a b = if a > b then a else b
