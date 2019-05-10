module Model exposing (..)

import Array exposing (Array)
import Dict exposing (Dict)
import Vec2 exposing (Vec2)


-- MODEL

type alias Model =
  { nodes: Nodes
  , result: Maybe NodeId

  , exampleText: ExampleText

  , search: Maybe String
  , dragMode: Maybe DragMode

  , view: View
  }

init : Model
init =
  { nodes = { values = Dict.empty, nextId = 0 }
  , result = Nothing
  , dragMode = Nothing
  , search = Nothing
  , view = View 0 (Vec2 0 0)
  , exampleText =
    { contents = String.repeat 12 "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment. Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring. Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line."
    , maxMatches = 4000
    , isEditing = False
    , cachedMatches = Nothing
    }
  }

type alias ExampleText =
  { isEditing: Bool
  , contents: String
  , maxMatches: Int
  , cachedMatches: Maybe (List (String, String))
  }

type alias View =
  { magnification : Float
  , offset : Vec2
  }

type DragMode
  = MoveNodeDrag { node : NodeId, mouse : Vec2 }
  | PrepareEditingConnection { node: NodeId, mouse: Vec2 }
  | CreateConnection { supplier : NodeId, openEnd : Vec2 }
  | RetainPrototypedConnection { node: NodeId, previousNodeValue: Maybe Node, mouse: Vec2 } -- FIXME same as createOrRemove??

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
  = SymbolNode Symbol

  | CharSetNode String
  | NotInCharSetNode String
  | LiteralNode String
  | CharRangeNode Char Char
  | NotInCharRangeNode Char Char

  | SetNode (Array NodeId)
  | SequenceNode (Array NodeId)

  | CaptureNode (Maybe NodeId)

  | IfAtEndNode (Maybe NodeId)
  | IfAtStartNode (Maybe NodeId)
  | IfFollowedByNode { expression : Maybe NodeId, successor : Maybe NodeId }
  | IfNotFollowedByNode { expression : Maybe NodeId, successor : Maybe NodeId }

  | OptionalNode (Maybe NodeId)
  | AtLeastOneNode (Maybe NodeId) -- TODO lazy repetition counts!
  | AnyRepetitionNode (Maybe NodeId) -- TODO lazy repetition counts!
  | RangedRepetitionNode { expression : Maybe NodeId, minimum: Int, maximum: Int } -- TODO lazy repetition counts!
  | MinimumRepetitionNode { expression : Maybe NodeId, minimum: Int  } -- TODO lazy repetition counts!
  | MaximumRepetitionNode { expression : Maybe NodeId, maximum: Int  } -- TODO lazy repetition counts!
  | ExactRepetitionNode { expression : Maybe NodeId, count : Int  } -- TODO lazy repetition counts!


  | FlagsNode { expression : Maybe NodeId, flags : RegexFlags }


{-| Any group of chars that can be represented by a single regex character, for example `\n` for linebreaks -}
type Symbol
  = WhitespaceChar
  | NonWhitespaceChar
  | DigitChar
  | NonDigitChar
  | WordChar
  | NonWordChar
  | WordBoundary
  | NonWordBoundary
  | LinebreakChar
  | NonLinebreakChar
  | TabChar
  | Never
  | Always

type alias Prototype =
  { name : String
  , node : Node
  }



prototypes : List Prototype
prototypes =
  [ symbolProto .whitespace (SymbolNode WhitespaceChar)
  , symbolProto .digit (SymbolNode DigitChar)
  , symbolProto .nonDigit (SymbolNode NonDigitChar)
  
  , typeProto .charset (CharSetNode ",.?!:")
  , typeProto .literal (LiteralNode "the")
  , typeProto .charRange (CharRangeNode 'A' 'Z')

  , typeProto .set (SetNode (Array.fromList []))
  , typeProto .sequence (SequenceNode (Array.fromList []))


  , symbolProto .nonWhitespace (SymbolNode NonWhitespaceChar)
  , typeProto .notInCharset (NotInCharSetNode ",.?!:")
  , typeProto .notInCharRange (NotInCharRangeNode 'A' 'Z')

  , typeProto .optional (OptionalNode Nothing)
  , typeProto .atLeastOne (AtLeastOneNode Nothing)
  , typeProto .anyRepetition (AnyRepetitionNode Nothing)

  , typeProto .ifAtEnd (IfAtEndNode Nothing)
  , typeProto .ifAtStart (IfAtStartNode Nothing)
  , typeProto .ifFollowedBy (IfFollowedByNode { expression = Nothing, successor = Nothing })
  , typeProto .ifNotFollowedBy (IfNotFollowedByNode { expression = Nothing, successor = Nothing })

  , symbolProto .wordBoundary (SymbolNode WordBoundary)
  , symbolProto .nonWordBoundary (SymbolNode NonWordBoundary)

  , typeProto .rangedRepetition (RangedRepetitionNode { expression = Nothing, minimum = 2, maximum = 4 })
  , typeProto .minimumRepetition (MinimumRepetitionNode { expression = Nothing, minimum = 2 })
  , typeProto .maximumRepetition (MaximumRepetitionNode { expression = Nothing, maximum = 4 })
  , typeProto .exactRepetition (ExactRepetitionNode { expression = Nothing, count = 3 })

  , symbolProto .word (SymbolNode WordChar)
  , symbolProto .nonWord (SymbolNode NonWordChar)
  , symbolProto .lineBreak (SymbolNode LinebreakChar)
  , symbolProto .nonLineBreak (SymbolNode NonLinebreakChar)
  , symbolProto .tab (SymbolNode TabChar)

  , typeProto .flags (FlagsNode { expression = Nothing, flags = defaultFlags })
  , typeProto .capture (CaptureNode Nothing)

  , symbolProto .none (SymbolNode Never)
  , symbolProto .any (SymbolNode Always)
  ]


typeProto getter = Prototype <| getter typeNames
symbolProto getter = Prototype <| getter symbolNames


symbolNames =
  { whitespace = "Whitespace Char"
  , nonWhitespace = "Non Whitespace Char"
  , digit = "Digit Char"
  , nonDigit = "Non Digit Char"
  , word = "Word Char"
  , nonWord = "Non Word Char"
  , wordBoundary = "Word Boundary"
  , nonWordBoundary = "Non Word Boundary"
  , lineBreak = "Linebreak Char"
  , nonLineBreak = "Non Linebreak Char"
  , tab = "Tab Char"
  , none = "Nothing"
  , any = "Anything"
  }

typeNames =
  { charset = "Any of Chars"
  , notInCharset = "None of Chars"
  , literal = "Char Sequence"
  , charRange = "Any of Char Range"
  , notInCharRange = "None of Char Range"
  , optional = "Optional"
  , set = "Any Of"
  , capture = "Capture"
  , ifAtEnd = "If At End Of Line"
  , ifAtStart = "If At Start Of Line"
  , ifNotFollowedBy = "If Not Followed By"
  , sequence = "Sequence"
  , flags = "Configuration"
  , exactRepetition = "Exact Repetition"
  , atLeastOne = "At Least One"
  , anyRepetition = "Any Repetition"
  , minimumRepetition = "Minimum Repetition"
  , maximumRepetition = "Maximum Repetition"
  , rangedRepetition = "Ranged Repetition"
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


symbolName symbol = case symbol of
  WhitespaceChar -> symbolNames.whitespace
  NonWhitespaceChar -> symbolNames.nonWhitespace
  DigitChar -> symbolNames.digit
  NonDigitChar -> symbolNames.nonDigit
  WordChar -> symbolNames.word
  NonWordChar -> symbolNames.nonWord
  WordBoundary -> symbolNames.wordBoundary
  NonWordBoundary -> symbolNames.nonWordBoundary
  LinebreakChar -> symbolNames.lineBreak
  NonLinebreakChar -> symbolNames.nonLineBreak
  TabChar -> symbolNames.tab
  Never -> symbolNames.none
  Always -> symbolNames.any
