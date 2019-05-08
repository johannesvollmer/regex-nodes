module Build exposing (..)

import Array
import Dict exposing (Dict)
import Regex

import Model exposing (..)


-- TODO precedence and empty sets need braces
-- TODO detect cycles??

type alias BuildResult a = Result String a


buildNodeExpression : Nodes -> Node -> BuildResult String
buildNodeExpression nodes node =
  let
    escapeCharset = escapeChars "[^-.\\]"
    escapeLiteral = escapeChars "[]{}()|^.-+*?!$/\\"


    set = String.join "|"
    capture child = "(" ++ child ++ ")"

    optional expression = expression ++ "?"
    atLeastOne expression = expression ++ "+"
    anyRepetition expression = expression ++ "*"

    exactRepetition count expression = expression ++ "{" ++ String.fromInt count ++ "}"
    minimumRepetition minimum expression = expression ++ "{" ++ String.fromInt minimum ++ ",}"
    maximumRepetition maximum expression = expression ++ "{0," ++ String.fromInt maximum ++ "}"
    rangedRepetition minimum maximum expression = expression
        ++ "{" ++ String.fromInt minimum
        ++ "," ++ String.fromInt maximum
        ++ "}"

    ifFollowedBy successor expression = expression ++ "(?=" ++ successor ++ ")"
    ifNotFollowedBy successor expression = expression ++ "(?!" ++ successor ++ ")"
    ifAtEnd expression = expression ++ "$"
    ifAtStart expression = "^" ++ expression

    charset chars = "[" ++ escapeCharset chars ++ "]"
    notInCharset chars = "[^" ++ escapeCharset chars ++ "]"
    charRange start end = "[" ++ escapeCharset (String.fromChar start) ++ "-" ++ escapeCharset (String.fromChar end) ++ "]"
    notInCharRange start end = "[^" ++ escapeCharset (String.fromChar start) ++ "-" ++ escapeCharset (String.fromChar end) ++ "]"
    literal chars = escapeLiteral chars





    ownPrecedence = precedence node

    build child = buildExpression nodes ownPrecedence child

    buildSingleChild map child = build child |> Result.map map

    buildMembers join members = members |> Array.toList
     |> List.map (Just >> build) |> collapseResults
     |> Result.map join |> Result.mapError (String.join ", ")

    string = case node of
      SymbolNode symbol -> symbol |> buildSymbol |> Ok
      CharSetNode chars -> Ok (charset chars)
      NotInCharSetNode chars -> Ok (notInCharset chars)
      CharRangeNode start end -> Ok (charRange start end)
      NotInCharRangeNode start end -> Ok (notInCharRange start end)
      LiteralNode chars -> Ok (literal chars)

      SequenceNode members -> buildMembers String.concat members
      SetNode options -> buildMembers set options
      CaptureNode child -> buildSingleChild capture child

      FlagsNode { expression } -> build expression -- we use flags directly at topmost level

      IfAtEndNode child -> buildSingleChild ifAtEnd child
      IfAtStartNode child -> buildSingleChild ifAtStart child
      IfNotFollowedByNode { expression, successor } -> Result.map2 ifNotFollowedBy (build successor) (build expression)
      IfFollowedByNode { expression, successor } -> Result.map2 ifFollowedBy (build successor) (build expression)

      OptionalNode child -> buildSingleChild optional child
      AtLeastOneNode child -> buildSingleChild atLeastOne child
      AnyRepetitionNode child -> buildSingleChild anyRepetition child
      ExactRepetitionNode { expression, count } -> buildSingleChild (exactRepetition count) expression
      RangedRepetitionNode { expression, minimum, maximum } -> buildSingleChild (rangedRepetition minimum maximum) expression
      MinimumRepetitionNode { expression, minimum } -> buildSingleChild (minimumRepetition minimum) expression
      MaximumRepetitionNode { expression, maximum } -> buildSingleChild (maximumRepetition maximum) expression


  in string

{-| Dereferences a node and returns `buildExpression` of it, handling corner cases -}
buildExpression : Nodes -> Int -> Maybe NodeId -> BuildResult String
buildExpression nodes ownPrecedence nodeId = case nodeId of
  Nothing -> Ok "(nothing)"
  Just id -> Dict.get id nodes.values
    |> okOrErr "Internal Error: Invalid Node Id"
    |> Result.andThen
      (\nodeView -> nodeView.node
        |> buildNodeExpression nodes
        |> Result.map (parenthesesForPrecedence ownPrecedence (precedence nodeView.node))
      )



type alias RegexBuild =
  { expression: String
  , flags: RegexFlags
  }


buildRegex : Nodes -> NodeId -> BuildResult RegexBuild
buildRegex nodes id =
  let
    expression = buildExpression nodes 0 (Just id)
    nodeView = Dict.get id nodes.values
    options = case nodeView |> Maybe.map .node of
      Just (FlagsNode { flags }) -> flags
      _ -> defaultFlags

  in expression |> Result.map (\ex -> RegexBuild ex options)


constructRegexLiteral : RegexBuild -> String
constructRegexLiteral regex =
  "/" ++ regex.expression ++ "/"
     ++ (if regex.flags.multiple then "g" else "")
     ++ (if regex.flags.caseSensitive then "" else "i")
     ++ (if regex.flags.multiline then "m" else "")


compileRegex : RegexBuild -> Regex.Regex
compileRegex build =
  let options = { caseInsensitive = not build.flags.caseSensitive, multiline = build.flags.multiline }
  in Regex.fromStringWith options build.expression |> Maybe.withDefault Regex.never


parenthesesForPrecedence ownPrecedence childPrecedence child =
  if ownPrecedence > childPrecedence then  "(?:" ++ child ++ ")" else child

precedence : Node -> Int
precedence node = case node of
    FlagsNode _ -> 0

    SetNode _ -> 1

    LiteralNode _ -> 2
    SequenceNode _ -> 2

    IfAtEndNode _ -> 3 -- TODO test
    IfAtStartNode _ -> 3 -- TODO test
    IfNotFollowedByNode _ -> 3
    IfFollowedByNode _ -> 3

    OptionalNode _ -> 4 -- at least one ...
    AtLeastOneNode _ -> 4
    MaximumRepetitionNode _ -> 4
    MinimumRepetitionNode _ -> 4
    ExactRepetitionNode _ -> 4
    RangedRepetitionNode _ -> 4
    AnyRepetitionNode _ -> 4

    CharSetNode _ -> 5
    NotInCharSetNode _ -> 5
    CharRangeNode _ _ -> 5
    NotInCharRangeNode _ _ -> 5
    CaptureNode _ -> 5
    SymbolNode _ -> 5



buildSymbol symbol = case symbol of
  WhitespaceChar -> "\\s"
  NonWhitespaceChar -> "\\S"
  DigitChar -> "\\d"
  NonDigitChar -> "\\D"
  WordChar -> "\\w"
  NonWordChar -> "\\W"
  WordBoundary -> "\\b"
  NonWordBoundary -> "\\B"
  LinebreakChar -> "\\n"
  NonLinebreakChar -> "."
  TabChar -> "\\t"
  Never -> "(?!)"
  Always -> "(.|\\n)"


-- if all elements ok, returns (Ok elementList), if any element is err, returns (Err errorList)
collapseResults : List (Result e k) -> Result (List e) (List k)
collapseResults list = List.foldr accumulateResult (Ok []) list


accumulateResult : Result e k -> Result (List e) (List k) -> Result (List e) (List k)
accumulateResult element collapsed =
  case collapsed of
    Ok okList ->
      case element of
        Ok okElement -> Ok (okElement :: okList)
        Err errElement -> Err [ errElement ]

    Err errorList ->
      case element of
        Ok _ -> Err errorList
        Err errElement -> Err (errElement :: errorList)


escapeChars pattern chars = chars |> String.toList
  |> List.concatMap (escapeChar (String.toList pattern))
  |> String.fromList

escapeChar pattern char =
  if List.member char pattern
    then [ '\\', char ]
    else [ char ]

okOrErr : e -> Maybe k -> Result e k
okOrErr error maybe = case maybe of
  Just value -> Ok value
  Nothing -> Err error