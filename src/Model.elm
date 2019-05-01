module Model exposing (..)

import Array exposing (Array)
import Dict exposing (Dict)
import Vec2 exposing (Vec2)


-- MODEL

type alias Model =
  { nodes : Nodes
  , result : Maybe NodeId

  , search : Maybe String
  , dragMode : Maybe DragMode

  , view : View
  }

init : Model
init =
  { nodes = { values = Dict.empty, nextId = 0 }
  , result = Nothing
  , dragMode = Nothing
  , search = Nothing
  , view = View 0 (Vec2 0 0)
  }

type alias View =
  { magnification : Float
  , offset : Vec2
  }

type DragMode
  = MoveNodeDrag { node : NodeId, mouse : Vec2 }
  | PrototypeConnectionDrag { supplier : NodeId, openEnd : Vec2 }

type alias NodeId = Int

type alias Nodes =
  { values : Dict NodeId NodeView
  , nextId : NodeId
  }

type alias NodeView =
  { position : Vec2
  , node : Node
  }

type Node
  = Whitespace
  | CharSet String
  | Optional (Maybe NodeId)
  | Set (Array NodeId)
  | Flags { expression : Maybe NodeId, flags : RegexFlags }
  | Repeated { expression : Maybe NodeId, count : Int  }
  | IfFollowedBy { expression : Maybe NodeId, successor : Maybe NodeId }

type alias Prototype =
  { name : String
  , node : Node
  }

prototypes : List Prototype
prototypes =
  [ Prototype typeNames.whitespace    Whitespace
  , Prototype typeNames.charset       (CharSet ",.?!:")
  , Prototype typeNames.optional      (Optional Nothing)
  , Prototype typeNames.set           (Set (Array.fromList []))
  , Prototype typeNames.flags         (Flags { expression = Nothing, flags = defaultFlags })
  , Prototype typeNames.repeated      (Repeated { expression = Nothing, count = 3 })
  , Prototype typeNames.ifFollowedBy  (IfFollowedBy { expression = Nothing, successor = Nothing })
  ]

typeNames =
  { whitespace = "Whitespace Char"
  , charset = "Char Set"
  , optional = "Optional"
  , set = "Any Of"
  , flags = "Flagged Expression"
  , repeated = "Repeated"
  , ifFollowedBy = "If Followed By"
  }

type alias RegexFlags =
  { multiple : Bool
  , caseSensitive : Bool
  , multiline : Bool
  }


viewTransform { magnification, offset} =
  { translate = offset
  , scale = 2 ^ (magnification * 0.4)
  }

defaultFlags = RegexFlags True True True
