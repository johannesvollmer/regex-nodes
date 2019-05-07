module Update exposing (..)

import Model exposing (..)
import Dict exposing (Dict)
import Vec2 exposing (Vec2)
import Parse exposing (..)




-- UPDATE

type Message
  = SearchMessage SearchMessage
  | DragModeMessage DragModeMessage
  | UpdateNodeMessage NodeId Node
  | UpdateView ViewMessage

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
  | StartEditingConnection { nodeId: NodeId, node: Node, supplier :Maybe NodeId, mouse :Vec2 }
  | StartCreateConnection { supplier: NodeId, mouse: Vec2 }
  | RealizeConnection { nodeId: NodeId, newNode: Node, mouse: Vec2 }
  | FinishDrag

  | UpdateDrag { newMouse : Vec2 }


update : Message -> Model -> Model
update message model =
  case message of
    UpdateView viewMessage -> case viewMessage of
      MagnifyView { amount, focus } ->
        { model | view = updateView amount focus model.view }

    UpdateNodeMessage id value ->
      { model | nodes = updateNode model.nodes id value }

    SearchMessage searchMessage ->
      case searchMessage of
        UpdateSearch query -> { model | search = Just query }
        FinishSearch result -> case result of
          InsertPrototype prototype -> { model | nodes = addNode model.nodes prototype, search = Nothing }
          ParseRegex regex -> { model | search = Nothing, nodes = addParsedRegexNode model.nodes regex }
          NoResult -> { model | search = Nothing }

    DragModeMessage modeMessage ->
      case modeMessage of
        StartNodeMove { node, mouse } ->
          { model | result = Just node
          , dragMode = Just (MoveNodeDrag { node = node, mouse = mouse })
          }

        -- update the subject node (disconnecting the input)
        -- and then start editing the connection of the old supplier

        -- TODO if current drag mode is retain, then reconnect to old node?
        StartEditingConnection { nodeId, node, supplier, mouse } ->
          Maybe.withDefault model <| Maybe.map
            (\oldSupplier ->
              { model | nodes = updateNode model.nodes nodeId node
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
          { model | nodes = updateNode model.nodes nodeId newNode
          , dragMode = Just (RetainPrototypedConnection { mouse = mouse, node = nodeId, previousNodeValue = Dict.get nodeId model.nodes.values |> Maybe.map .node })
          }

        FinishDrag ->
          { model | dragMode = Nothing }





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



updateFollowedByExpression followed expression = IfFollowedByNode { followed | expression = expression }
updateFollowedBySuccessor followed successor = IfFollowedByNode { followed | successor = successor }

updateNotFollowedByExpression followed expression = IfNotFollowedByNode { followed | expression = expression }
updateNotFollowedBySuccessor followed successor = IfNotFollowedByNode { followed | successor = successor }

updateCharRangeFirst end maybeStart = CharRangeNode (maybeStart |> Maybe.withDefault 'a') end
updateCharRangeLast start maybeEnd = CharRangeNode start (maybeEnd |> Maybe.withDefault 'z')

updateNotInCharRangeFirst end maybeStart = NotInCharRangeNode (maybeStart |> Maybe.withDefault 'a') end
updateNotInCharRangeLast start maybeEnd = NotInCharRangeNode start (maybeEnd |> Maybe.withDefault 'z')

updateExactRepetitionExpression repetition expression = ExactRepetitionNode { repetition | expression = expression }
updateExactRepetitionCount repetition count = ExactRepetitionNode { repetition | count = count }

updateMinimumRepetitionExpression repetition expression = MinimumRepetitionNode { repetition | expression = expression }
updateMinimumRepetitionCount repetition count = MinimumRepetitionNode { repetition | minimum = count }

updateMaximumRepetitionExpression repetition expression = MaximumRepetitionNode { repetition | expression = expression }
updateMaximumRepetitionCount repetition count = MaximumRepetitionNode { repetition | maximum = count }

updateRangedRepetitionExpression repetition expression = RangedRepetitionNode { repetition | expression = expression }
updateRangedRepetitionMinimum repetition count = RangedRepetitionNode { repetition | minimum = count }
updateRangedRepetitionMaximum repetition count = RangedRepetitionNode { repetition | maximum = count }

updateFlagsExpression flags newInput = FlagsNode { flags | expression = newInput }
updateFlags expression newFlags = FlagsNode { expression = expression, flags = newFlags }
updateFlagsMultiple { expression, flags } multiple = updateFlags expression { flags | multiple = multiple }
updateFlagsInsensitivity { expression, flags } caseSensitive = updateFlags expression { flags | caseSensitive = caseSensitive }
updateFlagsMultiline { expression, flags } multiline = updateFlags expression { flags | multiline = multiline }

