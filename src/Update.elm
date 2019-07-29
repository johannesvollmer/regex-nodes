module Update exposing (..)

import AutoLayout
import Model exposing (..)
import Build exposing (buildRegex, compileRegex, cycles)
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
  | DuplicateNode NodeId
  | AutoLayout NodeId
  | DismissCyclesError -- TODO remove monolithic structure
  | Deselect
  | Undo
  | Redo
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
  | InsertLiteral String
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

maxUndoSteps = 100


update : Message -> Model -> Model
update message model =
  let
    coreModel = model.history.present
    advance newPresent = { model | history = advanceHistory model.history newPresent }
    advanceModel newModel = { newModel | history = advanceHistory model.history newModel.history.present }

  in case message of
    DoNothing -> model

    Undo -> { model | history = undo model.history }
    Redo -> { model | history = redo model.history }

    DismissCyclesError -> advance { coreModel | cyclesError = False }

    Deselect -> if coreModel.outputNode.locked
      then advance { coreModel | selectedNode = Nothing }
      else advance <| updateCache { coreModel | selectedNode = Nothing, outputNode = { locked = False, id = Nothing } } coreModel

    UpdateExampleText textMessage -> case textMessage of

      SetEditing enabled -> if not enabled
        -- update cache because text contents or match limit could have been changed
        then advance <| updateCache (enableEditingExampleText enabled coreModel) coreModel
        else advance <| enableEditingExampleText enabled coreModel

      UpdateContents text -> let old = coreModel.exampleText in
        advance { coreModel | exampleText = { old | contents = text } }

      UpdateMaxMatchLimit limit -> let old = coreModel.exampleText in
        advance { coreModel | exampleText = { old | maxMatches = limit } }


    UpdateView viewMessage ->
      if coreModel.exampleText.isEditing
        || IdMap.isEmpty coreModel.nodes

      then model

      else case viewMessage of
          MagnifyView { amount, focus } ->
            { model | view = updateView amount focus model.view }

    SetOutputLocked locked ->
      advance { coreModel | outputNode = { id = coreModel.outputNode.id, locked = locked } }

    UpdateNodeMessage id value ->
      advance <| updateCache { coreModel | nodes = updateNode coreModel.nodes id value } coreModel

    DuplicateNode id -> advance <| duplicateNode coreModel id
    DeleteNode id -> advanceModel <| deleteNode id model

    AutoLayout id -> advance <| { coreModel | nodes = AutoLayout.layout id coreModel.nodes }

    SearchMessage searchMessage ->
      case searchMessage of
        UpdateSearch query -> { model | search = Just query }
        FinishSearch result -> case result of
          NoResult -> { model | search = Nothing }
          InsertLiteral text -> advanceModel <| insertNode (LiteralNode text) model
          InsertPrototype prototype -> advanceModel <| (insertNode prototype (stopEditingExampleText model))
          ParseRegex regex -> advanceModel <|
            (parseRegexNodes (stopEditingExampleText model) regex)

    DragModeMessage modeMessage ->
      case modeMessage of
        StartNodeMove { node, mouse } ->
          advanceModel <| startNodeMove mouse node model

        StartViewMove drag ->
          { model | dragMode = (Just <| MoveViewDrag drag) }

        -- update the subject node (disconnecting the input)
        -- and then start editing the connection of the old supplier
        -- TODO if current drag mode is retain, then reconnect to old node?
        StartEditingConnection { nodeId, node, supplier, mouse } ->
          advanceModel <| startEditingConnection nodeId node supplier mouse model


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
          advanceModel <| realizeConnection model nodeId newNode mouse

        FinishDrag ->
          { model | dragMode = Nothing }



advanceHistory history model =
  { past = List.take maxUndoSteps (history.present :: history.past), present = model, future = [] }

undo history = case history.past of
  last :: older -> { past = older, present = last, future = history.present :: history.future }
  _ -> history

redo history = case history.future of
  next :: newer -> { past = history.present :: history.past, present = next, future = newer }
  _ -> history


updatePresent model presentUpdater =
  let  history = model.history in
  { model | history = { history | present = presentUpdater history.present } }


-- FIXME should not connect at all
realizeConnection model nodeId newNode mouse =
  let
    newPresent present = updateCache
      { present | nodes = updateNode present.nodes nodeId newNode }
      present

    newDragMode = RetainPrototypedConnection
      { mouse = mouse, node = nodeId
      , previousNodeValue = IdMap.get nodeId model.history.present.nodes |> Maybe.map .node
      }

    newModel = updatePresent model newPresent

  in
    { newModel | dragMode = Just newDragMode }

deleteNode: NodeId -> Model -> Model
deleteNode nodeId model =
  let
    output = if model.history.present.outputNode.id == Just nodeId
      then Nothing else model.history.present.outputNode.id

    newNodeValues = model.history.present.nodes |> IdMap.remove nodeId
      |> IdMap.updateAllValues (\view -> { view | node = onNodeDeleted nodeId view.node })

    newPresent present = updateCache
      { present
      | nodes = newNodeValues
      , outputNode = { id = output, locked = present.outputNode.locked }
      }
      present

    newModel = updatePresent model newPresent

  in
    { newModel | dragMode = Nothing }


duplicateNode: CoreModel -> NodeId -> CoreModel
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

        in { model | nodes = IdMap.insertAnonymous clone nodes }

insertNode: Node -> Model -> Model
insertNode node model =
    let
      position = Vec2.inverseTransform (Vec2 800 400) (viewTransform model.view)
      newPresent present = { present | nodes = IdMap.insertAnonymous (NodeView position node) present.nodes }
      newModel = updatePresent model newPresent
    in { newModel | search = Nothing }

parseRegexNodes: Model -> String -> Model
parseRegexNodes model regex =
    let
      history = model.history
      coreModel = history.present

      position = Vec2.inverseTransform (Vec2 1000 400) (viewTransform model.view)
      resultNodes = addParsedRegexNode position coreModel.nodes regex

      -- select the generated result and autolayout
      resultHistory resultNodeId nodes =
        { history | present = selectNode resultNodeId { coreModel | nodes = AutoLayout.layout resultNodeId nodes } }

      -- clear the search
      resultModel (resultNodeId, nodes) =
        { model | history = resultHistory resultNodeId nodes, search = Nothing }

    in resultNodes |> Result.map resultModel |> Result.withDefault model


startNodeMove: Vec2 -> NodeId -> Model -> Model
startNodeMove mouse node model =
  let
    history = model.history
    present = history.present

  in { model
    | dragMode = Just (MoveNodeDrag { node = node, mouse = mouse })
    , history = { history | present = selectNode node present }
    }

startEditingConnection : NodeId -> Node -> Maybe NodeId -> Vec2 -> Model -> Model
startEditingConnection nodeId node currentSupplier mouse model =
  let
    newPresent present = updateCache
      { present | nodes = updateNode present.nodes nodeId node }
      present

    newModel = updatePresent model newPresent

    updateIt oldSupplier =
      { newModel | dragMode = Just (CreateConnection { supplier = oldSupplier, openEnd = mouse }) }

  in currentSupplier |>  Maybe.map updateIt |> Maybe.withDefault model


selectNode: NodeId -> CoreModel -> CoreModel
selectNode node model =
  let
    safeModel = { model | selectedNode = Just node }

    possiblyInvalidModel = { safeModel
      | outputNode = if not model.outputNode.locked || model.outputNode.id == Nothing
          then { id = Just node, locked = model.outputNode.locked }
          else model.outputNode
      }

  in if model.outputNode.id /= possiblyInvalidModel.outputNode.id
    -- only update cache if node really changed
    then updateCache possiblyInvalidModel safeModel else possiblyInvalidModel



stopEditingExampleText: Model -> Model
stopEditingExampleText model =
  updatePresent model (enableEditingExampleText False)

enableEditingExampleText: Bool -> CoreModel -> CoreModel
enableEditingExampleText enabled model =
  let old = model.exampleText in
  { model | exampleText = { old | isEditing = enabled } }


updateNode : Nodes -> NodeId -> Node -> Nodes
updateNode nodes id newNode =
  nodes |> IdMap.update id (\nodeView -> { nodeView | node = newNode })


moveNodeInModel: Vec2 -> Vec2 -> NodeId -> Model -> Model
moveNodeInModel newMouse mouse node model =
  let
    delta = Vec2.sub newMouse mouse
    newPresent present = { present |nodes = moveNode model.view present.nodes node delta }
    newModel = updatePresent model newPresent

  in { newModel | dragMode = Just (MoveNodeDrag { node = node, mouse = newMouse }) }

moveViewInModel: Vec2 -> Vec2 -> Model -> Model
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


-- TODO ( updateUrl "regex result" )
updateCache : CoreModel -> CoreModel -> CoreModel
updateCache model fallback =
  let
    example = model.exampleText
    regex = model.outputNode.id |> Maybe.map (buildRegex model.nodes)

  in if regex == Just (Err cycles)
    then { fallback | cyclesError = True } else
    let
      multiple = regex |> Maybe.map
        (Result.map (.flags >> .multiple) >> Result.withDefault False)
        |> Maybe.withDefault False

      compiled = regex |> Maybe.andThen (Result.map compileRegex >> Result.map Just >> Result.withDefault Nothing)
      newExample = { example | cachedMatches = Maybe.map (extractMatches multiple example.maxMatches example.contents) compiled }

    in { model | exampleText = newExample, cyclesError = False, cachedRegex = regex } -- hide error on success


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
    visualizeMatch match = String.replace " " "\u{200B}␣\u{200B}" match -- " " "\u{200A}·\u{200A}" match
    visualize matchList = List.map (Tuple.mapSecond visualizeMatch) matchList

  in matches |> extract |> simplify |> visualize

