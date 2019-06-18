module Build exposing (..)

import Array
import IdMap
import Regex

import Model exposing (..)



cycles = "Nodes have cycles" -- TODO use enum

{-
The "cycle detection" works by having a cost attached to each node
while generating the regular expression, and cycles being infinite
will always exceed the maximum cost.

This means that overly complex (non-cyclic) nodes also will be rejected,
and the message text currently incorrectly says it's because of cycles in the node graph.
This will be improved later but it has a low priority.
-}



escapeCharset = escapeChars "[^-.\\]"
escapeLiteral = escapeChars "[]{}()|^.-+*?!$/\\"
andMinimal min expression = if min
  then expression ++ "?" else expression


set options = if not (List.isEmpty options)
  then String.join "|" options
  else "(nothing)"

capture child = "(" ++ child ++ ")"

sequence members = if not (List.isEmpty members)
   then String.concat members
   else "(nothing)"

optional min expression = expression ++ "?" |> andMinimal min
atLeastOne min expression = expression ++ "+" |> andMinimal min
anyRepetition min expression = expression ++ "*" |> andMinimal min

exactRepetition count expression = expression ++ "{" ++ String.fromInt count ++ "}"
minimumRepetition min minimum expression = expression ++ "{" ++ String.fromInt minimum ++ ",}"  |> andMinimal min
maximumRepetition min maximum expression = expression ++ "{0," ++ String.fromInt maximum ++ "}"  |> andMinimal min
rangedRepetition min minimum maximum expression = expression
    ++ "{" ++ String.fromInt minimum
    ++ "," ++ String.fromInt maximum
    ++ "}" |> andMinimal min

ifFollowedBy successor expression = expression ++ "(?=" ++ successor ++ ")"
ifNotFollowedBy successor expression = expression ++ "(?!" ++ successor ++ ")"

charset chars = "[" ++ escapeCharset chars ++ "]"
notInCharset chars = "[^" ++ escapeCharset chars ++ "]"
charRange start end = "[" ++ escapeCharset (String.fromChar start) ++ "-" ++ escapeCharset (String.fromChar end) ++ "]"
notInCharRange start end = "[^" ++ escapeCharset (String.fromChar start) ++ "-" ++ escapeCharset (String.fromChar end) ++ "]"
literal chars = escapeLiteral chars





buildNodeExpression : Int -> Nodes -> Node -> BuildResult (Int, String)
buildNodeExpression cost nodes node =
  let
    ownPrecedence = precedence node
    build childParens depth child = buildExpression childParens depth nodes ownPrecedence child

    buildSingleChild childParens map child = build childParens cost child |> Result.map (Tuple.mapSecond map)
    buildTwoChildren map childParens1 child1 childParens2 child2 =
      let
          first = build childParens1 cost child1
          buildSecond (firstCost, _) = build childParens2 firstCost child2
          merge (_, firstChild) (totalCost, secondChild) = (totalCost, map firstChild secondChild)

      in Result.map2 merge first (Result.andThen buildSecond first)

    buildMember : Bool -> NodeId -> Result String (Int, List String) -> Result String (Int, List String)
    buildMember childParens element lastResult =
      lastResult |> Result.andThen (\(currentCost, builtMembers) ->
        (build childParens currentCost (Just element)) |> Result.map (Tuple.mapSecond (\e -> e :: builtMembers))
      )

    buildMembers childParens join members = members |> Array.toList
      |> List.foldr (buildMember childParens) (Ok (cost, []))
      |> Result.map (Tuple.mapSecond join)

    string = case node of
      SymbolNode symbol -> Ok (cost, buildSymbol symbol)
      CharSetNode chars -> Ok (cost, charset chars)
      NotInCharSetNode chars -> Ok (cost, notInCharset chars)
      CharRangeNode start end -> Ok (cost, charRange start end)
      NotInCharRangeNode start end -> Ok (cost, notInCharRange start end)
      LiteralNode chars -> Ok (cost, literal chars)

      SequenceNode members -> buildMembers True sequence members
      SetNode options -> buildMembers True set options
      CaptureNode child -> buildSingleChild False capture child

      FlagsNode { expression } -> build False cost expression -- we use flags directly at topmost level

      IfNotFollowedByNode { expression, successor } -> buildTwoChildren ifNotFollowedBy False successor True expression
      IfFollowedByNode { expression, successor } -> buildTwoChildren ifFollowedBy False successor True expression

      OptionalNode { expression, minimal } -> buildSingleChild True (optional minimal) expression
      AtLeastOneNode { expression, minimal } -> buildSingleChild True (atLeastOne minimal) expression
      AnyRepetitionNode { expression, minimal } -> buildSingleChild True (anyRepetition minimal) expression
      ExactRepetitionNode { expression, count } -> buildSingleChild True (exactRepetition count) expression
      RangedRepetitionNode { expression, minimum, maximum, minimal } -> buildSingleChild True (rangedRepetition minimal minimum maximum) expression
      MinimumRepetitionNode { expression, count, minimal } -> buildSingleChild True (minimumRepetition minimal count) expression
      MaximumRepetitionNode { expression, count, minimal } -> buildSingleChild True (maximumRepetition minimal count) expression

  in string

{-| Dereferences a node and returns `buildExpression` of it, handling corner cases -}
buildExpression : Bool -> Int -> Nodes -> Int -> Maybe NodeId -> BuildResult (Int, String)
buildExpression childMayNeedParens cost nodes ownPrecedence nodeId =
  if cost < 0 then Err cycles
  else case nodeId of
    Nothing -> Ok (cost, "(nothing)")

    Just id ->
      let
        nodeResult = IdMap.get id nodes
          |> okOrErr "Internal Error: Invalid Node Id"

        parens node = if childMayNeedParens
          then parenthesesForPrecedence ownPrecedence (precedence node)
          else identity

        build: Node -> BuildResult (Int, String)
        build node = buildNodeExpression (cost - 1) nodes node |> Result.map (Tuple.mapSecond (parens node))
        built = nodeResult |> Result.andThen (.node >> build)

      in built



buildRegex : Nodes -> NodeId -> BuildResult (RegexBuild)
buildRegex nodes id =
  let
    maxCost = (IdMap.size nodes) * 6
    expression = buildExpression False maxCost nodes 0 (Just id)
    nodeView = IdMap.get id nodes
    options = case nodeView |> Maybe.map .node of
      Just (FlagsNode { flags }) -> flags
      _ -> defaultFlags

  in expression |> Result.map (\(_, string) -> RegexBuild string options)


constructRegexLiteral : RegexBuild -> String
constructRegexLiteral regex =
  "/" ++ regex.expression ++ "/"
     ++ (if regex.flags.multiple then "g" else "")
     ++ (if regex.flags.caseInsensitive then "i" else "")
     ++ (if regex.flags.multiline then "m" else "")


compileRegex : RegexBuild -> Regex.Regex
compileRegex build =
  let options = { caseInsensitive = build.flags.caseInsensitive, multiline = build.flags.multiline }
  in Regex.fromStringWith options build.expression |> Maybe.withDefault Regex.never


parenthesesForPrecedence ownPrecedence childPrecedence child =
  if ownPrecedence > childPrecedence && childPrecedence < 5 -- atomic children don't need any parentheses
    then  "(?:" ++ child ++ ")" else child

precedence : Node -> Int
precedence node = case node of
    FlagsNode _ -> 0

    SetNode _ -> 1

    LiteralNode text ->
      if String.length text == 1
        then 5
        else 2

    SequenceNode _ -> 2 -- TODO collapse if only one member

--    IfAtEndNode _ -> 3
--    IfAtStartNode _ -> 3 can if-at-start be a symbol?
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
    CaptureNode _ -> 5 -- TODO will produce unnecessary parens if
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
  Start -> "^"
  End -> "$"


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