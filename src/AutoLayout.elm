module AutoLayout exposing (..)

import Array
import Dict
import IdMap
import Model exposing (..)
import Set
import Vec2 exposing (Vec2)



layout: Bool -> NodeId -> Nodes -> Nodes
layout hard nodeId nodes =
  let
    -- build simulation from real node graph
    current = buildBlockGraph nodeId nodes

    -- do a manual base layout as a starting point, if desired
    baseBlocks = if hard
      then baseLayout nodeId current
      else current

    -- do an iterative physical layout
    smoothedBlocks = forceBasedLayout baseBlocks

    finalBlocks = smoothedBlocks

    -- move all nodes such that the main node does not move
    delta = Maybe.map2 (\original new -> Vec2.sub original.position new.position)
      (IdMap.get nodeId nodes) (Dict.get nodeId finalBlocks)
      |> Maybe.withDefault Vec2.zero

    -- transfer simulation to real node graph
    updateNode id nodeView =
      case Dict.get id finalBlocks of
        Nothing -> nodeView
        Just simulatedBlock ->
          { nodeView | position = Vec2.add delta simulatedBlock.position }

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

-- TODO if a node has multiple outputs, it should be placed in the lowest layer
-- TODO layout every node once, which also avoids stack overflow on circular node graphs

baseLayout : NodeId -> NodeBlocks -> NodeBlocks
baseLayout nodeId blocks =
  let
    totalHeight = treeHeight blocks nodeId
    block = Dict.get nodeId blocks
    { x, y } = block |> Maybe.map .position |> Maybe.withDefault Vec2.zero
    size = block |> Maybe.map .size |> Maybe.withDefault Vec2.zero

  in baseLayoutToHeight nodeId blocks totalHeight (x + size.x) (y - 0.5*totalHeight + 0.5*size.y)

baseHorizontalPadding = 2 * propertyHeight
layerHeightFactor = 1

baseLayoutToHeight : NodeId -> NodeBlocks -> Float -> Float -> Float -> NodeBlocks
baseLayoutToHeight nodeId blocks height rightX topY =
  case Dict.get nodeId blocks of
    Nothing -> blocks
    Just block ->
      let

        -- increase spacing where many children stack up to a great height
        childrenRightX = rightX - block.size.x - baseHorizontalPadding
          - layerHeightFactor * propertyHeight * toFloat (List.length block.inputs)

        layoutSubBlock input (y, subblocks) =
          let
            subHeight = treeHeight blocks input
          in (y + subHeight, baseLayoutToHeight input subblocks subHeight childrenRightX y)

        (_, newBlocks) = List.map .connected block.inputs
          |> deduplicateInOrder
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
  block.inputs
    |> List.map .connected
    |> deduplicateRandomOrder
    |> List.map (treeHeight blocks)
    |> List.foldr (+) 0

blockSelfHeight block =
  block.size.y + 2 * propertyHeight



deduplicateRandomOrder: List comparable -> List comparable
deduplicateRandomOrder = Set.fromList >> Set.toList

deduplicateInOrder: List comparable -> List comparable
deduplicateInOrder list =
  List.foldr buildDedupSet ([], Set.empty) list |> Tuple.first

buildDedupSet element (resultList, resultSet) =
  if Set.member element resultSet then (resultList, resultSet)
    else (element :: resultList, Set.insert element resultSet)




-- ITERATIVE FORCE LAYOUT

-- force proportions:
uncollide = 1
horizontalUntwist = 0.6
horizontalGroup = 0.001
verticalConvergence = 0.0001
groupAll = 0.000000001

-- minimal distances:
horizontalPadding = 1 * propertyHeight
collisionPadding = 0.9 * propertyHeight
keepDistanceToLargeLayers = 2 * propertyHeight

-- automatic calculation of number of iterations
forceBasedLayout blocks =
  let
    atLeast = max
    nodes = Dict.size blocks |> toFloat
    complexity = nodes * nodes
    budged = 2048 * 32

    desiredIterations = budged / complexity
    iterations = floor desiredIterations |> atLeast 1

  in repeat iterations iterateLayout blocks


iterateLayout blocks = blocks |> Dict.map (iterateBlock blocks)


hasInput input block =
  List.map .connected block.inputs |> List.member input


-- simulating a single block
iterateBlock: NodeBlocks -> NodeId -> NodeBlock -> NodeBlock
iterateBlock  blocks id block =
  let
      accumulateForceBetweenNodes otherId otherBlock force =
          if id == otherId then force else
          let
            center = Vec2.ray 0.5 block.size block.position
            otherCenter = Vec2.ray 0.5 otherBlock.size otherBlock.position
            minDistance = 0.6 * (Vec2.length block.size) + 0.6 * (Vec2.length otherBlock.size) + collisionPadding
            difference = Vec2.sub center otherCenter
            distance = Vec2.length difference

            distanceForce =
              if distance < minDistance then Vec2.scale (0.5 * uncollide / distance) difference -- push apart if colliding (normalizing the difference) (0.5 because every node only pushes itself)
              else Vec2.scale -(groupAll * distance) difference -- pull together slightly

            otherIsInput = hasInput otherId block
            otherIsOutput = hasInput id otherBlock

            smoothnessBetween leftBlock rightBlock =
              rightBlock.position.x - (leftBlock.position.x + leftBlock.size.x)
                - horizontalPadding -- - keepDistanceToLargeLayers * abs difference.y
                - keepDistanceToLargeLayers * (toFloat <| max (List.length leftBlock.inputs) (List.length rightBlock.inputs))

            smoothen left right =
                let smoothness = smoothnessBetween left right
                in (if smoothness < 0 then horizontalUntwist else horizontalGroup) * -smoothness


            horizontalConnectionForce =
              if otherIsInput then smoothen otherBlock block
--                let smoothness = smoothnessBetween otherBlock block
--                in (if smoothness < 0 then horizontalUntwist else horizontalGroup) * -smoothness

              else if otherIsOutput then -(smoothen block otherBlock)
--                let smoothness = smoothnessBetween block otherBlock
--                in -((if smoothness < 0 then horizontalUntwist else horizontalGroup) * -smoothness)
              else 0

            verticalConnectionForce =
              if otherIsInput || otherIsOutput then
                verticalConvergence * -difference.y
              else 0


            connectionForce = Vec2 (0.5 * horizontalConnectionForce) (0.5 * verticalConnectionForce) -- * 0.5 because every node processes every other
          in
             force |> Vec2.add distanceForce |> Vec2.add connectionForce

      collisionForce = blocks |> Dict.foldr accumulateForceBetweenNodes Vec2.zero
      totalForce = collisionForce
  in
    { block | position = Vec2.add block.position totalForce }

repeat: Int -> (a -> a) -> a -> a
repeat count action value =
  if count <= 0 then value
  else repeat (count - 1) action (action value) -- tail call

























