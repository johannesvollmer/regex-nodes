module Update exposing (..)

import Model exposing (..)
import Dict exposing (Dict)
import Vec2 exposing (Vec2)
import Parse exposing (..)


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
  | StartCreateOrRemoveConnection { node: NodeId }
  | EditConnection { nodeId: NodeId, node: Node, supplier : Maybe NodeId, mouse : Vec2 }
  | StartPrototypeConnect { supplier : NodeId, mouse : Vec2 }
  | UpdateDrag { newMouse : Vec2 }
  | ConnectPrototype { nodeId: NodeId, newNode: Node }
  | FinishDrag


update : Message -> Model -> Model
update message model =
  case message of
    UpdateView viewMessage -> case viewMessage of
      MagnifyView { amount, focus } ->
        let
          magnification = model.view.magnification + amount
          transform = viewTransform { magnification = magnification, offset = model.view.offset }

          oldTransform = viewTransform model.view
          deltaScale = transform.scale / oldTransform.scale

          newView = if transform.scale < 0.1 || transform.scale > 16 then model.view else
            { magnification = magnification
            , offset =
              { x = (model.view.offset.x - focus.x) * deltaScale + focus.x
              , y = (model.view.offset.y - focus.y) * deltaScale + focus.y
              }
            }
        in { model | view = newView }

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
        EditConnection { nodeId, node, supplier, mouse } ->
          Maybe.withDefault model <| Maybe.map
            (\oldSupplier ->
              { model | nodes = updateNode model.nodes nodeId node
              , dragMode = Just (CreatePrototypeConnectionDrag { supplier = oldSupplier, openEnd = mouse })
              }
            )
            supplier


        StartPrototypeConnect { supplier, mouse } ->
          { model | dragMode = Just (CreatePrototypeConnectionDrag { supplier = supplier, openEnd = mouse }) }

        StartCreateOrRemoveConnection { node } ->
          { model | dragMode = Just (CreateOrRemoveConnection { node = node }) }

        UpdateDrag { newMouse } ->
          case model.dragMode of
            Just (MoveNodeDrag { node, mouse }) ->
              let delta = Vec2.sub newMouse mouse in
              { model | nodes = moveNode model.view model.nodes node delta
              , dragMode = Just (MoveNodeDrag { node = node, mouse = newMouse })
              }

            Just (CreatePrototypeConnectionDrag { supplier }) ->
              let mode = CreatePrototypeConnectionDrag { supplier = supplier, openEnd = newMouse } in
              { model | dragMode = Just mode }

            _ -> model

        -- when a connection is established, update the drag mode of the model,
        -- but also already make the connection real
        ConnectPrototype { nodeId, newNode } ->
          { model | nodes = updateNode model.nodes nodeId newNode
          , dragMode = Just (RetainPrototypedConnection { node = nodeId, previousNodeValue = Dict.get nodeId model.nodes.values |> Maybe.map .node })
          }

        FinishDrag ->
          { model | dragMode = Nothing }





updateCharSetChars newChars = CharSet newChars
updateOptionalOption newInput = Optional newInput
updateSetOptions options = Set options

updateFollowedByExpression followed expression = IfFollowedBy { followed | expression = expression }
updateFollowedBySuccessor followed successor = IfFollowedBy { followed | successor = successor }

updateRepetitionExpression repetition expression = Repeated { repetition | expression = expression }
updateRepetitionCount repetition count = Repeated { repetition | count = count }

updateFlagsExpression flags newInput = Flags { flags | expression = newInput }
updateFlags expression newFlags = Flags { expression = expression, flags = newFlags }
updateFlagsMultiple { expression, flags } multiple = updateFlags expression { flags | multiple = multiple }
updateFlagsInsensitivity { expression, flags } caseSensitive = updateFlags expression { flags | caseSensitive = caseSensitive }
updateFlagsMultiline { expression, flags } multiline = updateFlags expression { flags | multiline = multiline }