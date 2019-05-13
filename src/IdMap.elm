module IdMap exposing (..)
import Dict exposing (Dict)

type alias Id = Int

type alias IdMap v =
  { dict : Dict Id v
  , nextId : Id
  }


empty = IdMap Dict.empty 0

isEmpty : IdMap v -> Bool
isEmpty idMap = idMap.dict |> Dict.isEmpty

insert : v -> IdMap v -> IdMap v
insert value idMap =
  { dict = idMap.dict |> Dict.insert idMap.nextId value
  , nextId = idMap.nextId + 1
  }

insertValue : v -> IdMap v -> (Id, IdMap v)
insertValue value idMap =
  ( idMap.nextId
  , insert value idMap
  )

remove : Id -> IdMap v -> IdMap v
remove id idMap = { idMap | dict = idMap.dict |> Dict.remove id  }

updateAll : (v -> v) -> IdMap v -> IdMap v
updateAll mapper idMap = { idMap | dict = idMap.dict |> Dict.map (\_ v -> mapper v) }

get : Id -> IdMap v -> Maybe v
get id idMap = idMap.dict |> Dict.get id

update : Id -> (v -> v) -> IdMap v -> IdMap v
update id mapper idMap =
  let updateDictValue oldValue = oldValue |> Maybe.map mapper
  in { idMap | dict = idMap.dict |> Dict.update id updateDictValue  }


toList : IdMap v -> List (Id, v)
toList idMap = idMap.dict |> Dict.toList