module Model exposing (..)

import Array exposing (Array)
import Vec2 exposing (Vec2)
import IdMap exposing (IdMap)

-- MODEL


-- TODO improve structure

type alias Model =
  { history: History

  , view: View
  , search: Maybe String
  , dragMode: Maybe DragMode
  }


type alias History =
  { past: List CoreModel
  , present: CoreModel
  , future: List CoreModel
  }


type alias CoreModel =
  { nodes: Nodes
  , outputNode: OutputNode
  , selectedNode: Maybe NodeId

  , exampleText: ExampleText
  , cachedRegex: Maybe (BuildResult RegexBuild)

  , cyclesError: Bool
  }


initialValue =
  { history = { past = [], present = initialHistoryValue, future = [] }
  , dragMode = Nothing
  , search = Nothing
  , view = View 0 Vec2.zero
  }


initialHistoryValue : CoreModel
initialHistoryValue =
  { nodes = IdMap.empty
  , outputNode = { id = Nothing, locked = False }
  , selectedNode = Nothing
  , cachedRegex = Nothing
  , cyclesError = False
  , exampleText =
    { contents = String.repeat 12 "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. With markdown, you can write inline html: `<img src=\"image.png\"/> and scripts <script type='text/javascript'>if(true){ console.log('Hello World!'); }</script>`. But what would that feel like? Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment! Take your laptop 🖥. Also, have a look at these japanese symbols: シンボル. Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards 4 streamlined cloud solution. Consider mailing to what_is_this_4@i-dont-do-mail.org User generated content in real-time will have 4-128 touchpoints for offshoring. Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line."
    , maxMatches = 4000
    , isEditing = False
    , cachedMatches = Nothing
    }
  }

type alias NodeId = IdMap.Id
type alias Nodes = IdMap NodeView

-- TODO
type alias Notifications =
  { cyclesError: Bool
  , parseRegexError: Bool
  , deletedNode: Bool -- TODO undo on click
  }

type alias BuildResult a = Result String a

type alias RegexBuild =
  { expression: String
  , flags: RegexFlags
  }

type alias OutputNode =
  { id: Maybe NodeId
  , locked: Bool
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
  = MoveNodeDrag { node: NodeId, mouse: Vec2 }
  | MoveViewDrag { mouse: Vec2 }

  | PrepareEditingConnection { node: NodeId, mouse: Vec2 }
  | CreateConnection { supplier: NodeId, openEnd: Vec2 }
  | RetainPrototypedConnection { node: NodeId, previousNodeValue: Maybe Node, mouse: Vec2 }


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

  | IfFollowedByNode { expression : Maybe NodeId, successor : Maybe NodeId }
  | IfNotFollowedByNode { expression : Maybe NodeId, successor : Maybe NodeId }

  | OptionalNode { expression: Maybe NodeId, minimal: Bool }
  | AtLeastOneNode { expression: Maybe NodeId, minimal: Bool }
  | AnyRepetitionNode { expression: Maybe NodeId, minimal: Bool }
  | RangedRepetitionNode { expression : Maybe NodeId, minimum: Int, maximum: Int, minimal: Bool }
  | MinimumRepetitionNode { expression : Maybe NodeId, count: Int, minimal: Bool }
  | MaximumRepetitionNode { expression : Maybe NodeId, count: Int, minimal: Bool }
  | ExactRepetitionNode { expression : Maybe NodeId, count : Int }

  | FlagsNode { expression : Maybe NodeId, flags : RegexFlags }

--  | Pattern { expression: Maybe NodeId, name: String }
--  | SubResultNode { expression: Maybe NodeId }


type Pattern
  = MinimalAlphabetLowercase
  | MinimalAlphabetUppercase
  | DecimalNumber
  | Integer
  | Hex
  | ScientificNumber
  | Punctuation

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
  | Start
  | End

type alias Prototype =
  { name : String
  , node : Node
  , description: String
  }



prototypes : List Prototype
prototypes =
  [ symbolProto .whitespace WhitespaceChar
  , symbolProto .nonWhitespace NonWhitespaceChar
  , symbolProto .digit DigitChar
  , symbolProto .nonDigit NonDigitChar
  
  , typeProto .charset (CharSetNode "AEIOU")
  , typeProto .set (SetNode (Array.fromList []))

  , typeProto .literal (LiteralNode "the")
  , typeProto .sequence (SequenceNode (Array.fromList []))

  , typeProto .charRange (CharRangeNode 'A' 'Z')
  , typeProto .notInCharRange (NotInCharRangeNode 'A' 'Z')
  , typeProto .notInCharset (NotInCharSetNode ";:!?")

  , typeProto .optional (OptionalNode { expression = Nothing, minimal = False })
  , typeProto .atLeastOne (AtLeastOneNode { expression = Nothing, minimal = False })
  , typeProto .anyRepetition (AnyRepetitionNode { expression = Nothing, minimal = False })

  , symbolProto .end End
  , symbolProto .start Start

  , symbolProto .wordBoundary WordBoundary
  , symbolProto .nonWordBoundary NonWordBoundary

  , typeProto .rangedRepetition (RangedRepetitionNode { expression = Nothing, minimum = 2, maximum = 4, minimal = False })
  , typeProto .minimumRepetition (MinimumRepetitionNode { expression = Nothing, count = 2, minimal = False })
  , typeProto .maximumRepetition (MaximumRepetitionNode { expression = Nothing, count = 4, minimal = False })
  , typeProto .exactRepetition (ExactRepetitionNode { expression = Nothing, count = 3 })

  , symbolProto .word WordChar
  , symbolProto .nonWord NonWordChar
  , symbolProto .lineBreak LinebreakChar
  , symbolProto .nonLineBreak NonLinebreakChar
  , symbolProto .tab TabChar

  , typeProto .flags (FlagsNode { expression = Nothing, flags = defaultFlags })
  , typeProto .capture (CaptureNode Nothing)

  , symbolProto .none Never
  , symbolProto .any Always


  , typeProto .ifFollowedBy (IfFollowedByNode { expression = Nothing, successor = Nothing })
  , typeProto .ifNotFollowedBy (IfNotFollowedByNode { expression = Nothing, successor = Nothing })
  ]


typeProto getter prototype = Prototype (getter typeNames) prototype (getter typeDescriptions)
symbolProto getter symbol = Prototype (getter symbolNames) (SymbolNode symbol) (getter symbolDescriptions)


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
  , end = "End of Text"
  , start = "Start of Text"
  }

typeNames =
  { charset = "Any of Chars"
  , notInCharset = "None of Chars"
  , literal = "Literal"
  , charRange = "Any of Char Range"
  , notInCharRange = "None of Char Range"
  , optional = "Optional"
  , set = "Any Of"
  , capture = "Capture"
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

symbolDescriptions =
  { whitespace = "Match any invisible char, such as the space between words and linebreaks"
  , nonWhitespace = "Match any char that is not invisible, for example neither space nor linebreaks"
  , digit = "Match any numerical char, from `0` to `9`, excluding punctuation"
  , nonDigit = "Match any char but numerical ones, matching punctuation"
  , word = "Match any alphabetical chars, and the underscore char `_`"
  , nonWord = "Match any char, but not alphabetical ones and not the underscore char `_`"
  , wordBoundary = "Matches where a word char has a whitespace neighbour"
  , nonWordBoundary = "Matches anywhere but not where a word char has a whitespace neighbour"
  , lineBreak = "Matches the linebreak, or newline, char `\\n`"
  , nonLineBreak = "Matches anything but the linebreak char `\\n`"
  , tab = "Matches the tab char `\\t`"
  , none = "Matches nothing ever, really"
  , any = "Matches any char, including linebreaks and whitespace"
  , end = "The end of line if Multiline Matches are enabled, or the end of the text otherwise"
  , start = "The start of line if Multiline Matches are enabled, or the start of the text otherwise"
  }


typeDescriptions =
  { charset = "Matches, where any char of the set is matched"
  , notInCharset = "Matches where not a single char of the set is matched"
  , literal = "Matches where that exact sequence of chars is found"
  , charRange = "Matches any char between the lower and upper range bound"
  , notInCharRange = "Matches any char outside of the range"
  , optional = "Allow omitting this expression and match anyways"
  , set = "Matches, where at least one of the options matches"
  , capture = "Capture this expression for later use, like replacing"
  , ifNotFollowedBy = "Match this expression only if the successor is not matched, without matching the successor itself"
  , sequence = "Matches, where all members in the exact order are matched one after another"
  , flags = "Configure how the whole regex operates"
  , exactRepetition = "Match where an expression is repeated exactly n times"
  , atLeastOne = "Allow this expression to occur multiple times"
  , anyRepetition = "Allow this expression to occur multiple times or not at all"
  , minimumRepetition = "Match where an expression is repeated at least n times"
  , maximumRepetition = "Match where an expression is repeated no more than n times"
  , rangedRepetition = "Only match if the expression is repeated in range"
  , ifFollowedBy = "Match this expression only if the successor is also matched, without matching the successor itself"
  }


type alias RegexFlags =
  { multiple : Bool
  , caseInsensitive : Bool
  , multiline : Bool
  }


viewTransform { magnification, offset} =
  { translate = offset
  , scale = 2 ^ (magnification * 0.4)
  }

defaultFlags = RegexFlags True False True


summary node = case node of
  LiteralNode literal -> Just ("`" ++ literal ++ "`")
  CharSetNode options -> Just ("One of `" ++ options ++ "`")
  NotInCharSetNode options -> Just ("None of `" ++ options ++ "`")
  CharRangeNode start end ->  Just ("One of `" ++ String.fromChar start ++ "` - `" ++ String.fromChar end ++ "`")
  NotInCharRangeNode start end ->  Just ("None of `" ++ String.fromChar start ++ "` - `" ++ String.fromChar end ++ "`")
  _ -> Nothing


toPattern nodeId nodes = case IdMap.get nodeId nodes of
  Just (CharRangeNode 'a' 'z') -> Just MinimalAlphabetLowercase
  Just (CharRangeNode 'A' 'Z') -> Just MinimalAlphabetUppercase
  _ -> Nothing


symbolName = symbolProperty symbolNames
symbolDescription = symbolProperty symbolDescriptions

symbolProperty properties symbol = case symbol of
  WhitespaceChar -> properties.whitespace
  NonWhitespaceChar -> properties.nonWhitespace
  DigitChar -> properties.digit
  NonDigitChar -> properties.nonDigit
  WordChar -> properties.word
  NonWordChar -> properties.nonWord
  WordBoundary -> properties.wordBoundary
  NonWordBoundary -> properties.nonWordBoundary
  LinebreakChar -> properties.lineBreak
  NonLinebreakChar -> properties.nonLineBreak
  TabChar -> properties.tab
  Never -> properties.none
  Always -> properties.any
  Start -> properties.start
  End -> properties.end

-- TODO DRY, like:    getProperties: Node -> List Property,
-- type alias Property = { inputs, name, description, has Output, updateValue ... }



type alias Property =
  { name : String
  , description: String
  , contents : PropertyValue
  , connectOutput : Bool
  }

-- if a property must be updated, return the whole new node
type alias OnChange a = a -> Node

type PropertyValue
  = BoolProperty Bool (OnChange Bool)
  | CharsProperty String (OnChange String)
  | CharProperty Char (OnChange Char)
  | IntProperty Int (OnChange Int)
  | ConnectingProperty (Maybe NodeId) (OnChange (Maybe NodeId))
  | ConnectingProperties Bool (Array NodeId) (OnChange (Array NodeId))
  | TitleProperty


nodeProperties : Node -> List Property
nodeProperties node =
  case node of
    SymbolNode symbol -> [ Property (symbolName symbol) (symbolDescription symbol) TitleProperty True ]

    CharSetNode chars ->
      [ Property typeNames.charset
          ("Matches " ++ String.join ", " (String.toList chars |> List.map String.fromChar))
          (CharsProperty chars CharSetNode) True
      ]

    NotInCharSetNode chars -> [ Property typeNames.notInCharset
          ("Matches any char but " ++ String.join ", " (String.toList chars |> List.map String.fromChar))
          (CharsProperty chars NotInCharSetNode) True ]

    LiteralNode literal ->
      [ Property typeNames.literal ("Matches exactly `" ++ literal ++ "` and nothing else")
          (CharsProperty literal LiteralNode) True
      ]

    CaptureNode captured ->
      [ Property typeNames.capture typeDescriptions.capture
          (ConnectingProperty captured CaptureNode) True
      ]

    CharRangeNode start end ->
      [ Property typeNames.charRange
          ("Match any char whose integer value is equal to or between " ++ String.fromChar start ++ " and " ++ String.fromChar end)
          TitleProperty True

      , Property "First Char" "The lower range bound char, will match itself" (CharProperty start (updateCharRangeFirst end)) False
      , Property "Last Char" "The upper range bound char, will match itself" (CharProperty end (updateCharRangeLast start)) False
      ]

    NotInCharRangeNode start end ->
      [ Property typeNames.notInCharRange
          ("Match any char whose integer value is neither equal to nor between " ++ String.fromChar start ++ " and " ++ String.fromChar end)
          TitleProperty True

      , Property "First Char" "The lower range bound char, will not match itself" (CharProperty start (updateNotInCharRangeFirst end)) False
      , Property "Last Char" "The upper range bound char, will not match itself" (CharProperty end (updateNotInCharRangeLast start)) False
      ]

    SetNode options ->
      [ Property typeNames.set typeDescriptions.set TitleProperty True
      , Property "•" "Match if this or any other option is matched" (ConnectingProperties False options SetNode) False
      ]

    SequenceNode members ->
      [ Property typeNames.sequence typeDescriptions.sequence TitleProperty True
      , Property "and then" "A member of the sequence" (ConnectingProperties True members SequenceNode) False
      ]

    FlagsNode flagsNode ->
      [ Property typeNames.flags typeDescriptions.flags
          (ConnectingProperty flagsNode.expression (updateFlagsExpression flagsNode)) False

      , Property "Multiple Matches" "Do not stop after the first match"
          (BoolProperty flagsNode.flags.multiple (updateFlagsMultiple flagsNode)) False

      , Property "Case Insensitive" "Match as if everything had the same case"
          (BoolProperty flagsNode.flags.caseInsensitive (updateFlagsInsensitivity flagsNode)) False

      , Property "Multiline Matches" "Allow every matches to be found across multiple lines"
          (BoolProperty flagsNode.flags.multiline (updateFlagsMultiline flagsNode)) False
      ]

    IfFollowedByNode followed ->
      [ Property typeNames.ifFollowedBy typeDescriptions.ifFollowedBy
          (ConnectingProperty followed.expression (IfFollowedByNode << updateExpression followed)) True

      , Property "Successor" "What needs to follow the expression"
          (ConnectingProperty followed.successor (IfFollowedByNode << updateSuccessor followed)) False
      ]

    IfNotFollowedByNode followed ->
      [ Property typeNames.ifNotFollowedBy typeDescriptions.ifNotFollowedBy
          (ConnectingProperty followed.expression (IfNotFollowedByNode << updateExpression followed)) True

      , Property "Successor" "What must not follow the expression"
          (ConnectingProperty followed.successor (IfNotFollowedByNode << updateSuccessor followed)) False
      ]

    OptionalNode option ->
      [ Property typeNames.optional typeDescriptions.optional
        (ConnectingProperty option.expression (OptionalNode << updateExpression option)) True

      , Property "Prefer None" "Prefer not to match"
          (BoolProperty option.minimal (OptionalNode << updateMinimal option)) False
      ]

    AtLeastOneNode counted ->
      [ Property typeNames.atLeastOne typeDescriptions.atLeastOne
          (ConnectingProperty counted.expression (AtLeastOneNode << updateExpression counted)) True

      , Property "Minimize Count" "Match as few occurences as possible"
          (BoolProperty counted.minimal (AtLeastOneNode << updateMinimal counted)) False
      ]

    AnyRepetitionNode counted ->
      [ Property typeNames.anyRepetition typeDescriptions.anyRepetition
        (ConnectingProperty counted.expression (AnyRepetitionNode << updateExpression counted)) True

      , Property "Minimize Count" "Match as few occurences as possible"
          (BoolProperty counted.minimal (AnyRepetitionNode << updateMinimal counted)) False
      ]

    ExactRepetitionNode repetition ->
      [ Property typeNames.exactRepetition
          ("Match only if this expression is repeated exactly " ++ String.fromInt repetition.count ++ " times")
          (ConnectingProperty repetition.expression (ExactRepetitionNode << updateExpression repetition)) True

      , Property "Count" "How often the expression is required"
          (IntProperty repetition.count (ExactRepetitionNode << updatePositiveCount repetition)) False
      ]

    RangedRepetitionNode counted ->
      [ Property typeNames.rangedRepetition
          ("Match only if the expression is repeated no less than " ++ String.fromInt counted.minimum
            ++ " and no more than " ++ String.fromInt counted.maximum ++ " times"
          )
          (ConnectingProperty counted.expression (RangedRepetitionNode << updateExpression counted)) True

      , Property "Minimum"
          ("Match only if the expression is repeated no less than " ++ String.fromInt counted.minimum ++ " times")
          (IntProperty counted.minimum (updateRangedRepetitionMinimum counted)) False

      , Property "Maximum"
          ("Match only if the expression is repeated no more than " ++ String.fromInt counted.maximum ++ " times")
          (IntProperty counted.maximum (updateRangedRepetitionMaximum counted)) False

      , Property "Minimize Count" "Match as few occurences as possible"
          (BoolProperty counted.minimal (RangedRepetitionNode << updateMinimal counted)) False
      ]

    MinimumRepetitionNode counted ->
      [ Property typeNames.minimumRepetition
          ("Match only if the expression is repeated no less than " ++ String.fromInt counted.count ++ " times")
          (ConnectingProperty counted.expression (MinimumRepetitionNode << updateExpression counted)) True

      , Property "Count" "Minimum number of repetitions"
          (IntProperty counted.count (MinimumRepetitionNode << updatePositiveCount counted)) False

      , Property "Minimize Count" "Match as few occurences as possible"
          (BoolProperty counted.minimal (MinimumRepetitionNode << updateMinimal counted)) False
      ]

    MaximumRepetitionNode counted ->
      [ Property typeNames.maximumRepetition
          ("Match only if the expression is repeated no more than " ++ String.fromInt counted.count ++ " times")
          (ConnectingProperty counted.expression (MaximumRepetitionNode << updateExpression counted)) True

      , Property "Count" "Maximum number of repetitions"
          (IntProperty counted.count (MaximumRepetitionNode << updatePositiveCount counted)) False

      , Property "Minimize Count" "Match as few occurences as possible"
          (BoolProperty counted.minimal (MaximumRepetitionNode << updateMinimal counted)) False
      ]

--    SubResultNode result ->
--      [ Property (compileRegexString expression nodes)
--        ("This property shows the connected expression")
--        (ConnectingProperty result.expression (SubResultNode << updateExpression result)) True
--      ]


-- TODO implement generically using (nodeProperties node)
onNodeDeleted : NodeId -> Node -> Node
onNodeDeleted deleted node =
  case node of
    SymbolNode _ -> node
    CharSetNode _ -> node
    NotInCharSetNode _ -> node
    LiteralNode _ -> node
    CharRangeNode _ _ -> node
    NotInCharRangeNode _ _ -> node

    SetNode members -> SetNode <| Array.filter ((/=) deleted) members
    SequenceNode members -> SequenceNode <| Array.filter ((/=) deleted) members
    CaptureNode child -> CaptureNode <| ifNotDeleted deleted child

    OptionalNode child -> OptionalNode <| ifExpressionNotDeleted deleted child
    AtLeastOneNode child -> AtLeastOneNode <| ifExpressionNotDeleted deleted child
    AnyRepetitionNode child -> AnyRepetitionNode <| ifExpressionNotDeleted deleted child
    FlagsNode value -> FlagsNode <| ifExpressionNotDeleted deleted value
    IfFollowedByNode value -> IfFollowedByNode <| ifExpressionNotDeleted deleted value
    IfNotFollowedByNode value -> IfNotFollowedByNode <| ifExpressionNotDeleted deleted value
    RangedRepetitionNode value -> RangedRepetitionNode <| ifExpressionNotDeleted deleted value
    MinimumRepetitionNode value -> MinimumRepetitionNode <| ifExpressionNotDeleted deleted value
    MaximumRepetitionNode value -> MaximumRepetitionNode <| ifExpressionNotDeleted deleted value
    ExactRepetitionNode value -> ExactRepetitionNode <| ifExpressionNotDeleted deleted value



ifNotDeleted deleted node =
  if node == Just deleted
    then Nothing else node

ifExpressionNotDeleted deleted values =
  { values | expression = ifNotDeleted deleted values.expression }


insertWhitePlaceholder = String.replace " " "␣"
removeWhitePlaceholder = String.replace "␣" " "


updateExpression node expression = { node | expression = expression }
updateSuccessor node successor = { node | successor = successor }
updateMinimal node minimal = { node | minimal = minimal }

updatePositiveCount node count = { node | count = positive count }

updateCharRangeFirst end start = CharRangeNode (minChar start end) (maxChar start end) -- swaps chars if necessary
updateCharRangeLast start end = CharRangeNode (minChar end start) (maxChar start end) -- swaps chars if necessary

updateNotInCharRangeFirst end start = NotInCharRangeNode (minChar start end) (maxChar start end) -- swaps chars if necessary
updateNotInCharRangeLast start end = NotInCharRangeNode (minChar end start) (maxChar start end) -- swaps chars if necessary

updateRangedRepetitionMinimum repetition count = RangedRepetitionNode
  { repetition | minimum = positive count, maximum = max (positive count) repetition.maximum }

updateRangedRepetitionMaximum repetition count = RangedRepetitionNode
  { repetition | maximum = positive count, minimum = min (positive count) repetition.minimum }

updateFlagsExpression flags newInput = FlagsNode { flags | expression = newInput }
updateFlags expression newFlags = FlagsNode { expression = expression, flags = newFlags }
updateFlagsMultiple { expression, flags } multiple = updateFlags expression { flags | multiple = multiple }
updateFlagsInsensitivity { expression, flags } caseInsensitive = updateFlags expression { flags | caseInsensitive = caseInsensitive }
updateFlagsMultiline { expression, flags } multiline = updateFlags expression { flags | multiline = multiline }

positive = Basics.max 0
minChar a b = if a < b then a else b
maxChar a b = if a > b then a else b


-- LAYOUT

propertyHeight = 25

nodeWidth node = case node of
  SymbolNode symbol -> symbol |> symbolName |> mainTextWidth
  CharSetNode chars -> mainTextWidth typeNames.charset + codeTextWidth chars + 3
  NotInCharSetNode chars -> mainTextWidth typeNames.charset + codeTextWidth chars + 3
  CharRangeNode _ _ -> mainTextWidth typeNames.charRange
  NotInCharRangeNode _ _ -> mainTextWidth typeNames.notInCharRange
  LiteralNode chars -> mainTextWidth typeNames.literal + codeTextWidth chars + 3
  OptionalNode _ -> stringWidth 10
  SetNode _ -> mainTextWidth typeNames.set
  FlagsNode _ -> mainTextWidth typeNames.flags
  IfFollowedByNode _ -> mainTextWidth typeNames.ifFollowedBy
  ExactRepetitionNode _ -> mainTextWidth typeNames.exactRepetition
  SequenceNode _ -> mainTextWidth typeNames.sequence
  CaptureNode _ -> mainTextWidth typeNames.capture
  IfNotFollowedByNode _ -> mainTextWidth typeNames.ifNotFollowedBy
  AtLeastOneNode _ -> mainTextWidth typeNames.atLeastOne
  AnyRepetitionNode _ -> mainTextWidth typeNames.anyRepetition
  RangedRepetitionNode _ -> mainTextWidth typeNames.rangedRepetition
  MinimumRepetitionNode _ -> mainTextWidth typeNames.minimumRepetition
  MaximumRepetitionNode _ -> mainTextWidth typeNames.maximumRepetition



-- Thanks, Html, for letting us hardcode those values <3
codeTextWidth = String.length >> (*) 5 >> toFloat
mainTextWidth text = text |> String.length |> toFloat |> stringWidth
stringWidth length =  (Basics.max 5 length) * (if length < 14 then 13 else 9)















