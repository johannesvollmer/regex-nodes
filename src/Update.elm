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


moveNode : Nodes -> NodeId -> Vec2 -> Nodes
moveNode nodes nodeId movement =
  let updateNodePosition node = Maybe.map (\n -> { n | position = Vec2.add n.position movement }) node
  in { nodes | values = Dict.update nodeId updateNodePosition nodes.values }



-- UPDATE

type Message
  = SearchMessage SearchMessage
  | DragModeMessage DragModeMessage
  | UpdateNodeMessage NodeId Node

type SearchMessage
  = UpdateSearch String
  | FinishSearch SearchResult

type SearchResult
  = InsertPrototype NodeView
  | ParseRegex String
  | NoResult

type DragModeMessage
  = StartNodeMove { node : NodeId, mouse : Vec2 }
  | StartPrototypeConnect { supplier : NodeId, mouse : Vec2 }
  | UpdateDrag { newMouse : Vec2 }
--| DragEntered { node : NodeId, property : Int } TODO??ß
  | FinishDrag


update : Message -> Model -> Model
update message model =
  case message of
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
            Just (MoveNodeDrag { node, mouse }) ->
              let delta = Vec2.sub newMouse mouse in
              { model | nodes = moveNode model.nodes node delta
              , dragMode = Just (MoveNodeDrag { node = node, mouse = newMouse })
              }

            Just (PrototypeConnectionDrag { supplier, openEnd }) ->
              let mode = PrototypeConnectionDrag { supplier = supplier, openEnd = openEnd } in
              { model | dragMode = Just mode }

            Nothing -> model

        FinishDrag ->
          { model | dragMode = Nothing }