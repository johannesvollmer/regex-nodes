module Vec2 exposing (..)


type alias Vec2 =
  { x : Float
  , y : Float
  }

add : Vec2 -> Vec2 -> Vec2
add a b = Vec2 (a.x + b.x) (a.y + b.y)

sub : Vec2 -> Vec2 -> Vec2
sub a b = Vec2 (a.x - b.x) (a.y - b.y)

scale : Vec2 -> Float -> Vec2
scale v s = Vec2 (v.x * s) (v.y * s)

fromTuple : (Float, Float) -> Vec2
fromTuple value = Vec2 (Tuple.first value) (Tuple.second value)
