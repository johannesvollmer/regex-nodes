module Parse exposing (..)

import Model exposing (..)

addParsedRegexNode : Nodes -> String -> Nodes
addParsedRegexNode nodes regex =



  nodes -- TODO



{-parseExpression expression =
  let
    (left, spaceOperatorAndRest) = parseExpression expression
    operatorAndRest = skipWhite spaceOperatorAndRest

  in if String.startsWith "|" operatorAndRest
    then Either left (parseExpression operatorAndRest)

-}

skipWhite = String.trimLeft