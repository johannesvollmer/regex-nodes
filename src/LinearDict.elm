module LinearDict exposing (..)

{-
  This is just like a Dict,
  but allows for non-comparable keys
-}


type alias LinearDict k v = List (k, v)

empty: LinearDict k v
empty = []

member: k -> LinearDict k v -> Bool
member key dict =
  get key dict /= Nothing

get : k -> LinearDict k v -> Maybe v
get key dict = dict
  |> List.filter (Tuple.first >> (==) key)
  |> List.head |> Maybe.map Tuple.second


insert: k -> v -> LinearDict k v -> LinearDict k v
insert key value dict = -- TODO can be done in a recursive function with only one iteration instead of 2
  if member key dict
    then dict |> List.map (replaceValueForKey key value)
    else (key, value) :: dict


replaceValueForKey: k -> v -> (k, v) -> (k, v)
replaceValueForKey key newValue (currentKey, currentValue) =
  if key == currentKey then (currentKey, newValue)
    else (currentKey, currentValue)


