module Parse exposing (..)

import Model exposing (..)

addParsedRegexNode : Nodes -> String -> Nodes
addParsedRegexNode nodes regex =

  nodes -- TODO







{-parseExpression expression =
  let
    (left, spaceOperatorAndRest) = parseExpression expression
    operatorAndRest = skipWhite spaceOperatorAndRest

  in case startsWith "|" operatorAndRest of
    Just rightSide

  if String.startsWith "|" operatorAndRest
    then Either left (parseExpression operatorAndRest)
-}


    {-
atom text =
  case text |> String.toList of
    '[' :: rest -> parseCharset rest
    '\\' :: rest -> parseEscapedAtom rest
    '?' :: (':' :: rest) -> parseGroup rest
    '(' :: rest -> parseCapturingGroup rest
--    [] -> Err
    rest -> parseCharAtom rest
-}
    {-
    if (string.startsWith("["))
    		return parseCharset(string)

    	else if (string.startsWith("\\"))
    		return parseEscapedAtom(string, {
    			...escape.digit, ...escape.word, ...escape.white,
    			...escape.tab, ...escape.linebreak,
    			...escape.boundary
    		})

    	else if (string.startsWith("(?:"))
    		return parseGroup(string)

    	else if (string.startsWith("("))
    		return parseCapturingGroup(string)

    else return parseCharAtom(string)
    -}




startsWith needle haystack =
  let withoutWhite = skipWhite haystack
  in if String.startsWith needle withoutWhite
    then Just withoutWhite
    else Nothing

skipWhite = String.trimLeft