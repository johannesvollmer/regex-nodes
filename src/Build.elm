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
    ownPrecedence = precedence node
    build child = buildExpression nodes ownPrecedence child
      -- |> Result.map (parenthesesForPrecedence ownPrecedence (precedence child))

    set = String.join "|"
    optional expression = expression ++ "?"
    repeated count expression = expression ++ "{" ++ String.fromInt count ++ "}"
    ifFollowedby successor expression = expression ++ "(?=" ++ successor ++ ")"


    string = case node of
      Whitespace -> Ok "\\w"
      CharSet chars -> Ok ("[" ++ chars ++ "]")
      Optional maybeInput -> (build maybeInput) |> Result.map optional
      Set options -> options |> Array.toList
        |> List.map (\option -> build (Just option)) |> collapseResults
        |> Result.map set |> Result.mapError (String.join ", ")

      Flags { expression } -> build expression -- we use flags directly at topmost level
      Repeated { expression, count } -> build expression |> Result.map (repeated count)
      IfFollowedBy { expression, successor } -> Result.map2 ifFollowedby (build successor) (build expression)

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
      Just (Flags { flags }) -> flags
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
  if ownPrecedence > childPrecedence then  "(" ++ child ++ ")" else child

precedence : Node -> Int
precedence node = case node of
    Whitespace -> 5
    CharSet _ -> 5
    -- literal _ -> 2
    Optional _ -> 4 -- at least one ...
    Set _ -> 1
    -- sequence _ -> 2
    Flags _ -> 0
    Repeated _ -> 4
    IfFollowedBy _ -> 3


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


okOrErr : e -> Maybe k -> Result e k
okOrErr error maybe = case maybe of
  Just value -> Ok value
  Nothing -> Err error