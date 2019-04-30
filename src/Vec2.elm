module Vec2 exposing (..)


type alias Vec2 =
  { x : Float
  , y : Float
  }

add : Vec2 -> Vec2 -> Vec2
add a b = Vec2 (a.x + b.x) (a.y + b.y)

sub : Vec2 -> Vec2 -> Vec2
sub a b = Vec2 (a.x - b.x) (a.y - b.y)

scale : Float -> Vec2 -> Vec2
scale s v = Vec2 (v.x * s) (v.y * s)

fromTuple : (Float, Float) -> Vec2
fromTuple value = Vec2 (Tuple.first value) (Tuple.second value)

inverseTransform : Vec2 -> { scale: Float, translate: Vec2 } -> Vec2
inverseTransform  value transformation =
  sub value transformation.translate |> scale (1 / transformation.scale)


transform : Vec2 -> { scale: Float, translate: Vec2 } -> Vec2
transform  value transformation =
  scale transformation.scale value |> add transformation.translate