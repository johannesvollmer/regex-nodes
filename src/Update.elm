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
  | StartPrototypeConnect { supplier : NodeId, mouse : Vec2 }
  | UpdateDrag { newMouse : Vec2 }
--  | DragEntered { node : NodeId, property : Int } TODO??ß
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

        StartPrototypeConnect { supplier, mouse } ->
          { model | dragMode = Just (PrototypeConnectionDrag { supplier = supplier, openEnd = mouse }) }

        UpdateDrag { newMouse } ->
          case model.dragMode of
            Nothing -> model

            Just (MoveNodeDrag { node, mouse }) ->
              let delta = Vec2.sub newMouse mouse in
              { model | nodes = moveNode model.view model.nodes node delta
              , dragMode = Just (MoveNodeDrag { node = node, mouse = newMouse })
              }

            Just (PrototypeConnectionDrag { supplier }) ->
              let mode = PrototypeConnectionDrag { supplier = supplier, openEnd = newMouse } in
              { model | dragMode = Just mode }


        FinishDrag ->
          { model | dragMode = Nothing }





updateCharSetChars nodeId newChars = UpdateNodeMessage nodeId (CharSet newChars)
updateOptionalOption nodeId newInput = UpdateNodeMessage nodeId (Optional newInput)
updateSetOptions nodeId options = UpdateNodeMessage nodeId (Set options)

updateFollowedByExpression nodeId followed expression = UpdateNodeMessage nodeId (IfFollowedBy { followed | expression = expression })
updateFollowedBySuccessor nodeId followed successor = UpdateNodeMessage nodeId (IfFollowedBy { followed | successor = successor })

updateRepetitionExpression nodeId repetition expression = UpdateNodeMessage nodeId (Repeated { repetition | expression = expression })
updateRepetitionCount nodeId repetition count = UpdateNodeMessage nodeId (Repeated { repetition | count = count })

updateFlagsExpression nodeId flags newInput = UpdateNodeMessage nodeId (Flags { flags | expression = newInput })
updateFlags nodeId expression newFlags = UpdateNodeMessage nodeId (Flags { expression = expression, flags = newFlags })
updateFlagsMultiple nodeId { expression, flags } multiple = updateFlags nodeId expression { flags | multiple = multiple }
updateFlagsInsensitivity nodeId { expression, flags } caseSensitive = updateFlags nodeId expression { flags | caseSensitive = caseSensitive }
updateFlagsMultiline nodeId { expression, flags } multiline = updateFlags nodeId expression { flags | multiline = multiline }