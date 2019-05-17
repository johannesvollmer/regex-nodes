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


-- TODO not all-or-nothing, but try the best guess at invalid input!


type ParsedElement
  = Sequence (List ParsedElement)
  | SingleCharOrSymbol CharOrSymbol
  | CharSequece String
  | Charset { inverted: Bool, contents: List CharOrSymbol }
  | ParsedSymbol Symbol
  | Set (List ParsedElement)
  | Capture ParsedElement
  | IfFollowedBy { expression: ParsedElement, successor: ParsedElement }
  | RangedRepetition { expression : ParsedElement, minimum: Int, maximum: Int, minimal: Bool }
  | Optional { expression: ParsedElement, minimal: Bool }
  | Flags { expression : ParsedElement, flags : RegexFlags }





addParsedRegexNodeOrNothing : Vec2 -> Nodes -> String -> Nodes
addParsedRegexNodeOrNothing position nodes regex =
  parse regex |> Result.map (addParsedElement position nodes) |> Result.withDefault nodes


addParsedElement : Vec2 -> Nodes -> ParsedElement -> Nodes
addParsedElement position nodes parsed = insert position parsed nodes |> Tuple.second

insert : Vec2 -> ParsedElement -> Nodes -> (NodeId, Nodes)
insert position element nodes = case element of
  Sequence elements ->
    let
      insertChild index child = insert (Vec2 -200 (75 * toFloat index) |> Vec2.add position) child
      (children, newNodes) = IdMap.insertListWith (List.indexedMap insertChild elements) nodes
      node = children |> Array.fromList |> SequenceNode |> NodeView position
    in IdMap.insertValue node newNodes

  SingleCharOrSymbol charOrSymbol -> case charOrSymbol of
    Plain char -> IdMap.insertValue (NodeView position (LiteralNode (String.fromChar char))) nodes -- TODO collapse consecutive literals
    Escaped symbol -> IdMap.insertValue (NodeView position (SymbolNode symbol)) nodes

  todo -> (-1, nodes) -- TODO



parse : String -> ParseResult ParsedElement
parse regex = set regex |> Result.map Tuple.first


set : String -> ParseSubResult ParsedElement
set text = sequence (String.startsWith "|") text  -- TODO


sequence: (String -> Bool) -> String -> ParseSubResult ParsedElement
sequence stop text = extendSequence stop (Ok ([], text))
  |> Result.map (Tuple.mapFirst Sequence)

extendSequence : (String -> Bool) -> ParseSubResult (List ParsedElement) -> ParseSubResult (List ParsedElement)
extendSequence stop current = case current of
  Err error -> Err error
  Ok (members, text) ->
    if String.isEmpty text || stop text
      then Ok (members, text)
      else positioned text
        |> Result.map (Tuple.mapFirst (appendTo members))
        |> extendSequence stop



positioned : String -> ParseSubResult ParsedElement
positioned text = lookAhead text -- TODO

lookAhead : String -> ParseSubResult ParsedElement
lookAhead text = quantified text -- TODO

quantified : String -> ParseSubResult ParsedElement
quantified text = atom text -- TODO

atom : String -> ParseSubResult ParsedElement
atom text =
  let
    isNext character = String.startsWith character text

  in
    if isNext "[" then charset text
    -- else if isNext "\\" then escapedAtom tokens
    -- else if isNext "(?:" then group text
    -- else if isNext "(" then capturingGroup
    else genericAtomicChar text


{-group : String -> ParseSubResult ParsedElement
group text =
  let
    contents = skipOrErr "(?:" text
    contents =
  in
-}

genericAtomicChar : String -> ParseSubResult ParsedElement
genericAtomicChar text = case text |> skipIfNext "." of

  (True, rest) -> Ok (SingleCharOrSymbol <| Escaped NonLinebreakChar, rest)

  (False, rest) -> rest
      |> atomicChar (maybeOptions symbolizeLetterbased symbolizeTabLinebreak)
      |> Result.map (Tuple.mapFirst SingleCharOrSymbol)


symbolizeTabLinebreak : Char -> Maybe Symbol
symbolizeTabLinebreak token = case token of
  't' -> Just TabChar
  'n' -> Just LinebreakChar
  _ -> Nothing



charset : String -> ParseSubResult ParsedElement
charset text =
    let
        withoutBracket = skipOrErr "[" text
        inversion = withoutBracket |> Result.map (skipIfNext "^")
        contents = extendCharset (inversion |> Result.map (Tuple.mapFirst <| always []))

        charsetFromResults (inverted, _) (options, remaining) =
          (Charset { inverted = inverted, contents = options }, remaining)

    in Result.map2 charsetFromResults inversion contents


-- TODO use foldr or similar?
extendCharset : ParseSubResult (List CharOrSymbol) -> ParseSubResult (List CharOrSymbol)
extendCharset current = case current of
  Err error -> Err error
  Ok (options, remaining) ->
    if String.isEmpty remaining
      then Err (Expected "]")

    else case skipIfNext "]" remaining of
      (True, rest) -> Ok (options, rest)
      (False, rest) -> charsetAtom rest
        |> Result.map (Tuple.mapFirst (appendTo options))
        |> extendCharset



charsetAtom : String -> ParseSubResult CharOrSymbol
charsetAtom = atomicChar (maybeOptions symbolizeLetterbased symbolizeTabLinebreakDot)

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


type CharOrSymbol = Plain Char | Escaped Symbol


atomicChar : (Char -> Maybe Symbol) -> String -> ParseSubResult (CharOrSymbol)
atomicChar escape text =
  let
    (isEscaped, charSubResult) = skipIfNext "\\" text |> Tuple.mapSecond singleChar

    symbolOrElsePlainChar character = character |> escape
      |> Maybe.map Escaped |> Maybe.withDefault (Plain character)

  in if isEscaped
    then charSubResult |> Result.map (Tuple.mapFirst symbolOrElsePlainChar)
    else charSubResult |> Result.map (Tuple.mapFirst Plain)


singleChar : String -> ParseSubResult Char
singleChar string = String.uncons string |> okOrErr ExpectedMoreChars


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