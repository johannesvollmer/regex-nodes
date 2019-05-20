module Parse exposing (..)

import Array
import IdMap
import Model exposing (..)
import Result
import Vec2 exposing (Vec2)

type alias ParseResult a = Result ParseError a
type alias ParseSubResult a = ParseResult (a, String)

type ParseError
  = ExpectedMoreChars
  | Expected String


-- TODO this parsing code is more complex than it needs to be (brackets must always be escaped and such)

-- TODO not all-or-nothing, but try the best guess at invalid input!

-- closer to the textual JS regex than to the node graph
type ParsedElement
  = ParsedSequence (List ParsedElement)
  | ParsedCharsetAtom CharsetAtom
  | ParsedCharset { inverted: Bool, contents: List CharsetAtom }
  | ParsedSet (List ParsedElement)
  | ParsedCapture ParsedElement
  | ParsedIfFollowedBy { expression: ParsedElement, successor: ParsedElement }
  | ParsedIfNotFollowedBy { expression: ParsedElement, successor: ParsedElement }
  | ParsedRangedRepetition { expression : ParsedElement, minimum: Int, maximum: Int, minimal: Bool }
  | ParsedAnyRepetition { expression : ParsedElement, minimal: Bool }
  | ParsedAtLeastOne { expression : ParsedElement, minimal: Bool }
  | ParsedOptional { expression: ParsedElement, minimal: Bool }
  | ParsedFlags { expression : ParsedElement, flags : RegexFlags }


-- closer to the node graph than to the JS regex
type CompiledElement
  = CompiledSequence (List CompiledElement)
  | CompiledSymbol Symbol
  | CompiledCharRange (Char, Char)
  | CompiledCharSequence String
  | CompiledCharset { inverted: Bool, contents: String }
  | CompiledSet (List CompiledElement)
  | CompiledCapture CompiledElement
  | CompiledIfFollowedBy { expression: CompiledElement, successor: CompiledElement }
  | CompiledIfNotFollowedBy { expression: CompiledElement, successor: CompiledElement }
  | CompiledRangedRepetition { expression : CompiledElement, minimum: Int, maximum: Int, minimal: Bool }
  | CompiledOptional { expression: CompiledElement, minimal: Bool }
  | CompiledAtLeastOne { expression: CompiledElement, minimal: Bool }
  | CompiledAnyRepetition { expression: CompiledElement, minimal: Bool }
  | CompiledFlags { expression : CompiledElement, flags : RegexFlags }


type CharsetAtom = Plain Char | Escaped Symbol | Range (Char, Char)

addParsedRegexNode : Vec2 -> Nodes -> String -> ParseResult (NodeId, Nodes)
addParsedRegexNode position nodes regex = parse regex
  |> Result.map (compile >> addCompiledElement position nodes)


addCompiledElement : Vec2 -> Nodes -> CompiledElement -> (NodeId, Nodes)
addCompiledElement position nodes parsed = insert position parsed nodes


-- TODO reuse existing intermediate result nodes

insert : Vec2 -> CompiledElement -> Nodes -> (NodeId, Nodes)
insert position element nodes = case element of
  CompiledSequence members ->
    let
      insertChild index child = insert (Vec2 -200 (75 * toFloat (index - List.length members // 2)) |> Vec2.add position) child
      (children, newNodes) = IdMap.insertListWith (List.indexedMap insertChild members) nodes
      node = children |> Array.fromList |> SequenceNode |> NodeView position
    in IdMap.insert node newNodes

  CompiledCharSequence sequence -> IdMap.insert
    (NodeView position (LiteralNode sequence)) nodes

  CompiledSymbol symbol -> IdMap.insert
    (NodeView position (SymbolNode symbol)) nodes

  CompiledCharRange (a, b) -> IdMap.insert
    (NodeView position (CharRangeNode a b)) nodes

  CompiledCapture child ->
    let (childId, nodesWithChild) = insert (Vec2 -200 0 |> Vec2.add position) child nodes
    in IdMap.insert (NodeView position (CaptureNode <| Just childId)) nodesWithChild

  CompiledCharset { inverted, contents } -> IdMap.insert
    (NodeView position (if inverted then NotInCharSetNode contents else CharSetNode contents)) nodes

  CompiledSet options ->
    let
      insertChild index child = insert (Vec2 -200 (75 * (toFloat (index - List.length options // 2))) |> Vec2.add position) child
      (children, newNodes) = IdMap.insertListWith (List.indexedMap insertChild options) nodes
      node = children |> Array.fromList |> SetNode |> NodeView position
    in IdMap.insert node newNodes

  CompiledIfFollowedBy { expression, successor } ->
    let
      (expressionId, nodesWithExpression) = insert (Vec2 -200 0 |> Vec2.add position) expression nodes
      (successorId, nodesWithChildren) = insert (Vec2 -200 75 |> Vec2.add position) successor nodesWithExpression
    in IdMap.insert
      (NodeView position (IfFollowedByNode { expression = Just expressionId, successor = Just successorId }))
      nodesWithChildren

  CompiledIfNotFollowedBy { expression, successor } ->
    let
      (expressionId, nodesWithExpression) = insert (Vec2 -200 0 |> Vec2.add position) expression nodes
      (successorId, nodesWithChildren) = insert (Vec2 -200 75 |> Vec2.add position) successor nodesWithExpression
    in IdMap.insert
      (NodeView position (IfNotFollowedByNode { expression = Just expressionId, successor = Just successorId }))
      nodesWithChildren

  CompiledRangedRepetition { expression, minimum, maximum, minimal } ->
    let (expressionId, nodesWithChild) = insert (Vec2 -200 0 |> Vec2.add position) expression nodes
    in IdMap.insert (NodeView position (RangedRepetitionNode { expression = Just expressionId, minimum = minimum, maximum = maximum, minimal = minimal })) nodesWithChild

  CompiledOptional { expression, minimal } ->
    let (expressionId, nodesWithChild) = insert (Vec2 -200 0 |> Vec2.add position) expression nodes
    in IdMap.insert (NodeView position (OptionalNode { expression = Just expressionId, minimal = minimal })) nodesWithChild

  CompiledAtLeastOne { expression, minimal } ->
    let (expressionId, nodesWithChild) = insert (Vec2 -200 0 |> Vec2.add position) expression nodes
    in IdMap.insert (NodeView position (AtLeastOneNode { expression = Just expressionId, minimal = minimal })) nodesWithChild

  CompiledAnyRepetition { expression, minimal } ->
    let (expressionId, nodesWithChild) = insert (Vec2 -200 0 |> Vec2.add position) expression nodes
    in IdMap.insert (NodeView position (AnyRepetitionNode { expression = Just expressionId, minimal = minimal })) nodesWithChild

    -- TODO DRY
  CompiledFlags { expression, flags } ->
    let (expressionId, nodesWithChild) = insert (Vec2 -200 0 |> Vec2.add position) expression nodes
    in IdMap.insert (NodeView position (FlagsNode { expression = Just expressionId, flags = flags })) nodesWithChild







-- TODO DRY
compile : ParsedElement -> CompiledElement
compile element = case element of
  ParsedSet [ onlyOneOption ] -> compile onlyOneOption
  ParsedSet options -> CompiledSet <| List.map compile options
  ParsedSequence manyMembers -> compileSequence manyMembers
  ParsedCapture child -> CompiledCapture <| compile child
  ParsedCharsetAtom charOrSymbol -> compileCharsetAtom charOrSymbol
  ParsedCharset set -> compileCharset set

  ParsedIfFollowedBy { expression, successor } -> CompiledIfFollowedBy
    { expression = compile expression, successor = compile successor }

  ParsedIfNotFollowedBy { expression, successor } -> CompiledIfNotFollowedBy
    { expression = compile expression, successor = compile successor }

  ParsedRangedRepetition { expression, minimum, maximum, minimal } -> CompiledRangedRepetition
    { expression = compile expression, minimum = minimum, maximum = maximum, minimal = minimal }

  ParsedOptional { expression, minimal } -> CompiledOptional
    { expression = compile expression, minimal = minimal }

  ParsedAnyRepetition { expression, minimal } -> CompiledAnyRepetition
    { expression = compile expression, minimal = minimal }

  ParsedAtLeastOne { expression, minimal } -> CompiledAtLeastOne
    { expression = compile expression, minimal = minimal }

  ParsedFlags { expression, flags } -> CompiledFlags
    { expression = compile expression, flags = flags }




compileCharsetAtom charOrSymbol = case charOrSymbol of
  Plain char -> CompiledCharSequence <| String.fromChar char
  Escaped symbol -> CompiledSymbol symbol
  Range range -> CompiledCharRange range

-- collapse all subsequent chars into a literal
compileSequence members = case List.foldr compileSequenceMember [] members of
  [ onlyOneMember ] -> onlyOneMember -- must be checked AFTER collapsing members
  moreMembers -> CompiledSequence moreMembers

compileSequenceMember member compiled = case member of
  ParsedCharsetAtom (Plain character) -> case compiled of
     CompiledCharSequence collapsed :: alreadyCompiled ->
         (CompiledCharSequence (String.fromChar character ++ collapsed)) :: alreadyCompiled

     -- cannot simplify chars if followed by something exotic
     nonCharsequenceCompiled ->
      CompiledCharSequence (String.fromChar character) :: nonCharsequenceCompiled -- ignore anything else

  symbol -> compile symbol :: compiled



compileCharset { inverted, contents } =
  case List.foldr compileCharsetOption ("", [], []) contents of
      (chars, [], []) -> CompiledCharset { inverted = inverted, contents = chars }
      ("", [symbol], []) -> CompiledSymbol symbol -- FIXME will ignore `inverted`
      ("", [], [range]) -> CompiledCharRange range
      ("", symbols, ranges) -> CompiledSet (List.map CompiledSymbol symbols ++ List.map CompiledCharRange ranges)  -- FIXME will ignore `inverted`
      (chars, symbols, ranges) -> CompiledSet <|
        CompiledCharset { inverted = inverted, contents = chars }
          :: (List.map CompiledSymbol symbols) -- TODO dry -- FIXME will ignore `inverted` in symbols
          ++ (List.map CompiledCharRange ranges) -- TODO dry -- FIXME will ignore `inverted` in symbols

-- TODO filter duplicate options
compileCharsetOption member (chars, symbols, ranges) = case member of
  Plain char -> (String.fromChar char ++ chars, symbols, ranges)
  Escaped symbol -> (chars, symbol :: symbols, ranges)
  Range (start, end) -> (chars, symbols, (start, end) :: ranges)


parse : String -> ParseResult ParsedElement
parse regex = parseFlags regex |> Result.map Tuple.first

parseFlags : String -> ParseSubResult ParsedElement
parseFlags text = parseSet text -- TODO

parseSet : String -> ParseSubResult ParsedElement
parseSet text =
  let firstOption = parseSequence text |> Result.map (Tuple.mapFirst List.singleton)
  in extendSet firstOption |> Result.map (Tuple.mapFirst ParsedSet)

extendSet : ParseSubResult (List ParsedElement) -> ParseSubResult (List ParsedElement)
extendSet current = case current of
  Err error -> Err error
  Ok (options, text) ->
    case skipIfNext "|" text of
      (True, rest) -> parseSequence rest
        |> Result.map (Tuple.mapFirst (appendTo options))
        |> extendSet

      (False, rest) ->
        Ok (options, rest)


parseSequence: String -> ParseSubResult ParsedElement
parseSequence text = extendSequence (Ok ([], text))
  |> Result.map (Tuple.mapFirst ParsedSequence)

extendSequence : ParseSubResult (List ParsedElement) -> ParseSubResult (List ParsedElement)
extendSequence current = case current of
  Err error -> Err error
  Ok (members, text) ->
    if String.isEmpty text || String.startsWith ")" text || String.startsWith "|" text
      then Ok (members, text)
      else parseLookAhead text
        |> Result.map (Tuple.mapFirst (appendTo members))
        |> extendSequence


parseLookAhead : String -> ParseSubResult ParsedElement
parseLookAhead text =
  let
    expressionResult = parseQuantified text
    extract (content, rest) =
      if String.startsWith "(?=" rest
        then parseParentheses (\s -> ParsedIfFollowedBy { expression = content, successor = s }) "(?=" rest

      else if String.startsWith "(?!" rest
        then parseParentheses (\s -> ParsedIfNotFollowedBy { expression = content, successor = s }) "(?!" rest

      else Ok(content, rest)

  in expressionResult |> Result.andThen extract



parseQuantified : String -> ParseSubResult ParsedElement
parseQuantified text = parseOptional text


parseOptional : String -> ParseSubResult ParsedElement
parseOptional text =
  let
    expressionResult = parseAtLeastOne text
    parseIt (expression, rest) =
      let
        (optional, rest1) = skipIfNext "?" rest
        (isLazy, rest2) = if optional
          then skipIfNext "?" rest1
          else (False, rest1)

      in if optional
        then (ParsedOptional { expression = expression, minimal = isLazy }, rest2)
        else (expression, rest2)

  in expressionResult |> Result.map parseIt

-- TODO DRY
parseAtLeastOne : String -> ParseSubResult ParsedElement
parseAtLeastOne text =
  let
    expressionResult = parseAnyRepetition text
    parseIt (expression, rest) =
      let
        (optional, rest1) = skipIfNext "+" rest
        (isLazy, rest2) = if optional
          then skipIfNext "?" rest1
          else (False, rest1)

      in if optional
        then (ParsedAtLeastOne { expression = expression, minimal = isLazy }, rest2)
        else (expression, rest2)

  in expressionResult |> Result.map parseIt


parseAnyRepetition : String -> ParseSubResult ParsedElement
parseAnyRepetition text =
  let
    expressionResult = parseRangedRepetition text
    parseIt (expression, rest) =
      let
        (optional, rest1) = skipIfNext "*" rest
        (isLazy, rest2) = if optional
          then skipIfNext "?" rest1
          else (False, rest1)

      in if optional
        then (ParsedAnyRepetition { expression = expression, minimal = isLazy }, rest2)
        else (expression, rest2)

  in expressionResult |> Result.map parseIt


parseRangedRepetition : String -> ParseSubResult ParsedElement
parseRangedRepetition text = parseAtom text -- TODO, also ExactRepetition!

-- an atom is any thing which has the highest precedence possible, especially brackets and characters
parseAtom : String -> ParseSubResult ParsedElement
parseAtom text =
  let
    isNext character = String.startsWith character text

  in
    if isNext "[" then parseCharset text
    else if isNext "(?:" then parseGroup text
    else if isNext "(" then parseCapturingGroup text
    else parseGenericAtomicChar text


parseGroup = parseParentheses identity "(?:"
parseCapturingGroup = parseParentheses ParsedCapture "("

parseParentheses : (ParsedElement -> ParsedElement) -> String -> String -> ParseSubResult ParsedElement
parseParentheses map openParens text =
  let
    contents = skipOrErr openParens text
    result = contents |> Result.andThen parseSet
  in result |> Result.map (Tuple.mapSecond (String.dropLeft 1)) -- drop the closing parentheses
    |> Result.map (Tuple.mapFirst map)

parseGenericAtomicChar : String -> ParseSubResult ParsedElement
parseGenericAtomicChar text =
 case String.uncons text of
   Just ('.', rest) -> Ok (ParsedCharsetAtom <| Escaped NonLinebreakChar, rest)
   Just ('$', rest) -> Ok (ParsedCharsetAtom <| Escaped End, rest)
   Just ('^', rest) -> Ok (ParsedCharsetAtom <| Escaped Start, rest)
   _ -> text
     |> parseAtomicChar (maybeOptions symbolizeLetterbased symbolizeTabLinebreak)
     |> Result.map (Tuple.mapFirst ParsedCharsetAtom)


symbolizeTabLinebreak : Char -> Maybe Symbol
symbolizeTabLinebreak token = case token of
  't' -> Just TabChar
  'n' -> Just LinebreakChar
  _ -> Nothing



parseCharset : String -> ParseSubResult ParsedElement
parseCharset text =
    let
        withoutBracket = skipOrErr "[" text
        inversion = withoutBracket |> Result.map (skipIfNext "^")
        contents = extendCharset (inversion |> Result.map (Tuple.mapFirst <| always []))

        charsetFromResults (inverted, _) (options, remaining) =
          (ParsedCharset { inverted = inverted, contents = options }, remaining)

    in Result.map2 charsetFromResults inversion contents


-- TODO use foldr or similar?
extendCharset : ParseSubResult (List CharsetAtom) -> ParseSubResult (List CharsetAtom)
extendCharset current = case current of
  Err error -> Err error
  Ok (options, remaining) ->
    if String.isEmpty remaining
      then Err (Expected "]")

    else case skipIfNext "]" remaining of
      (True, rest) -> Ok (options, rest)
      (False, rest) -> parseCharsetAtom rest
        |> Result.map (Tuple.mapFirst (appendTo options))
        |> extendCharset



parseCharsetAtom : String -> ParseSubResult CharsetAtom
parseCharsetAtom text =
  let
      atom = parseAtomicChar (maybeOptions symbolizeLetterbased symbolizeTabLinebreakDot)

      extractRange : (Char, String) -> ParseSubResult CharsetAtom
      extractRange (firstAtom, remaining) = case skipIfNext "-" remaining of
        (True, rest) -> atom rest |> Result.andThen atomToCharOrErr
                                  |> Result.map (Tuple.mapFirst (Tuple.pair firstAtom >> Range))

        _ -> Ok (Plain firstAtom, remaining)

  in case atom text of
      Ok (Plain char, rest) -> extractRange (char, rest)
      other -> other


atomToCharOrErr : (CharsetAtom, String) -> ParseSubResult Char
atomToCharOrErr (atom, rest) = case atom of
  Plain char -> Ok (char, rest)
  _ -> Err (Expected "Plain Character")


-- in a charset, the dot char must be escaped, because a plain dot is just a dot and not anything but linebreak
symbolizeTabLinebreakDot : Char -> Maybe Symbol
symbolizeTabLinebreakDot token = case token of
  't' -> Just TabChar
  'n' -> Just LinebreakChar
  '.' -> Just NonLinebreakChar
  _ -> Nothing

-- does not escape any brackets
symbolizeLetterbased : Char -> Maybe Symbol
symbolizeLetterbased token = case token of
  'd' -> Just DigitChar
  'D' -> Just NonDigitChar
  's' -> Just WhitespaceChar
  'S' -> Just NonWhitespaceChar
  'w' -> Just WordChar
  'W' -> Just NonWordChar
  'b' -> Just WordBoundary
  'B' -> Just NonWordBoundary
  _ -> Nothing




parseAtomicChar : (Char -> Maybe Symbol) -> String -> ParseSubResult (CharsetAtom)
parseAtomicChar escape text =
  let
    (isEscaped, charSubResult) = skipIfNext "\\" text |> Tuple.mapSecond parseSingleChar

    symbolOrElsePlainChar character = character |> escape
      |> Maybe.map Escaped |> Maybe.withDefault (Plain character)

  in if isEscaped
    then charSubResult |> Result.map (Tuple.mapFirst symbolOrElsePlainChar)
    else charSubResult |> Result.map (Tuple.mapFirst Plain)


parseSingleChar : String -> ParseSubResult Char
parseSingleChar string = String.uncons string |> okOrErr ExpectedMoreChars


skipOrErr : String -> String -> ParseResult String
skipOrErr symbol text = if String.startsWith symbol text
  then text |> String.dropLeft (String.length symbol) |> Ok
  else Err (Expected symbol)

skipIfNext : String -> String -> (Bool, String)
skipIfNext symbol text = if String.startsWith symbol text
  then (True, text |> String.dropLeft (String.length symbol))
  else (False, text)

okOrErr : ParseError -> Maybe v -> ParseResult v
okOrErr error = Maybe.map Ok >> Maybe.withDefault (Err error)

appendTo : List a -> a -> List a
appendTo list element = list ++ [element]

maybeOptions : (a -> Maybe b) -> (a -> Maybe b) -> a -> Maybe b
maybeOptions first second value = case first value of
  Just result -> Just result
  Nothing -> second value




oneOf a b v = a v || b v