module AutoLayout exposing (..)

import Array
import Dict
import IdMap
import Model exposing (..)
import Vec2 exposing (Vec2)



layout: NodeId -> Nodes -> Nodes
layout nodeId nodes =
  let
    -- build simulation from real node graph
    current = buildBlockGraph nodeId nodes

    -- do a manual base layout as a starting point
    updatedBlocks = baseLayout nodeId current

    -- transfer simulation to real node graph
    updateNode id nodeView =
      case Dict.get id updatedBlocks of
        Nothing -> nodeView
        Just simulatedBlock ->
          { nodeView | position = simulatedBlock.position }

  in IdMap.updateAll updateNode nodes


type alias NodeBlock =
  { position: Vec2 -- top left corner
  , size: Vec2 -- rectangle width x height
  , inputs: List { property: Int, connected: NodeId }
  }

type alias NodeBlocks = Dict.Dict NodeId NodeBlock


buildBlockGraph: NodeId -> Nodes -> NodeBlocks
buildBlockGraph nodeId nodes =
  case IdMap.get nodeId nodes of
    Nothing -> Dict.empty
    Just nodeView ->
      let
          properties = nodeProperties nodeView.node

          size = Vec2 (nodeWidth nodeView.node) (List.length properties |> toFloat |> (*) propertyHeight)
          positionedBlock = NodeBlock nodeView.position size

          getInputs property = case property.contents of
            ConnectingProperties _ props _ -> List.map Just (Array.toList props)
            ConnectingProperty prop _ -> [ prop ]
            _ -> [ Nothing ]

          inputs = properties |> List.map getInputs |> flattenList
          indexedInputs = inputs |> List.indexedMap
            (\index input -> Maybe.map (\i -> { property = index, connected = i }) input)

          filteredInputs = List.filterMap identity indexedInputs
          filteredRawInputs = List.filterMap identity inputs

          blocksOfInput input blocks = Dict.union blocks (buildBlockGraph input nodes)
          inputBlocks = List.foldr blocksOfInput Dict.empty filteredRawInputs
          block = positionedBlock filteredInputs

      in Dict.insert nodeId block inputBlocks


flattenList list = List.foldr (++) [] list


baseLayout : NodeId -> NodeBlocks -> NodeBlocks
baseLayout nodeId blocks =
  let
    totalHeight = treeHeight blocks nodeId
    block = Dict.get nodeId blocks
    { x, y } = block |> Maybe.map .position |> Maybe.withDefault (Vec2 0 0)
    size = block |> Maybe.map .size |> Maybe.withDefault (Vec2 0 0)

  in baseLayoutToHeight nodeId blocks totalHeight (x + size.x) (y - 0.5*totalHeight + 0.5*size.y)

baseLayoutToHeight : NodeId -> NodeBlocks -> Float -> Float -> Float -> NodeBlocks
baseLayoutToHeight nodeId blocks height rightX topY =
  case Dict.get nodeId blocks of
    Nothing -> blocks
    Just block ->
      let

        -- increase spacing where many children stack up to a great height
        childrenRightX = rightX - block.size.x - propertyHeight
          - 0.5*propertyHeight * toFloat (List.length block.inputs)

        layoutSubBlock input (y, subblocks) =
          let
            subHeight = treeHeight blocks input
          in (y + subHeight, baseLayoutToHeight input subblocks subHeight childrenRightX y)

        (_, newBlocks) = List.map .connected block.inputs
          |> List.foldl layoutSubBlock (topY, blocks)

        newBlock = { block | position = Vec2 (rightX - block.size.x) (topY + 0.5 * height - 0.5 * block.size.y) }

      in
        Dict.insert nodeId newBlock newBlocks


treeHeight: NodeBlocks -> NodeId -> Float
treeHeight blocks nodeId  =
  case Dict.get nodeId blocks of
    Just block -> max (blockSelfHeight block) (blockChildrenHeight blocks block)
    Nothing -> 0

blockChildrenHeight blocks block =
  block.inputs |> List.map (.connected >> treeHeight blocks)
    |> List.foldr (+) 0

blockSelfHeight block =
  block.size.y + 2 * propertyHeight





-- TODO: Iterative force-directed layout?

-- PRIORITIES:
-- 1. MOVE OVERLAPPING NODES APART
-- 2. MAKE CONNECTIONS SMOOTH IN HORIZONTAL DIRECTION
-- 3. MOVE ALL NODES CLOSE TO EACH OTHER


































