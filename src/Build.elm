module Build exposing (..)

import Array
import Dict exposing (Dict)
import Regex

import Model exposing (..)


-- TODO precedence and empty sets need braces

buildNodeExpression : Nodes -> Node -> String
buildNodeExpression nodes node =
  let build = buildExpression nodes in
  case node of
    Whitespace -> "\\w"
    CharSet chars -> "[" ++ chars ++ "]"
    Optional maybeInput -> (build maybeInput) ++ "?"
    Set options -> Array.map (\option -> build (Just option)) options |> Array.toList |> String.join "|"
    Flags { expression } -> build expression -- we use flags directly at topmost level
    Repeated { expression, count } -> (build expression) ++ "{" ++ (String.fromInt count) ++ "}"
    IfFollowedBy { expression, successor } -> (build expression) ++ "(?=" ++ (build successor) ++ ")"


{-| Dereferences a node and returns `buildExpression` of it, handling corner cases -}
buildExpression : Nodes -> Maybe NodeId -> String
buildExpression nodes nodeId = case nodeId of
  Nothing -> "(nothing)"
  Just id -> Maybe.map .node (Dict.get id nodes.values)
    |> Maybe.map (buildNodeExpression nodes)
    |> Maybe.withDefault "(error)"


type alias RegexBuild =
  { expression: String
  , flags: RegexFlags
  }


buildRegex : Nodes -> NodeId -> RegexBuild
buildRegex nodes id =
  let
    expression = buildExpression nodes (Just id)
    nodeView = Dict.get id nodes.values
    options = case Maybe.map .node nodeView of
      Just (Flags { flags }) -> flags
      _ -> defaultFlags

  in RegexBuild expression options


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


