port module Main exposing (..)

import Browser
import Build
import Model
import Update
import Url
import Base64
import View

port url : String -> Cmd msg


main = Browser.element
  { init = \flags -> (init flags, Cmd.none)
  , update = \message model -> update message model
  , subscriptions = always Sub.none
  , view = View.view
  }


init rawUrl =
  let
    expression = case String.split "?expression=" rawUrl of
      _ :: [ query ] -> Just  query
      _ -> Nothing

    escapedExpression = expression |> Maybe.andThen Url.percentDecode
      -- expression is base64 encoded because firefox will change backslashes to regular slashes
      |> Maybe.andThen (Base64.decode >> Result.toMaybe)
      |> Maybe.withDefault "/\\s(?:the|for)/g"

  in
    Model.initialValue |> Update.update -- cannot be done in Model due to circular imports
      (Update.SearchMessage <| Update.FinishSearch <| Update.ParseRegex escapedExpression)

update message model =
  let
    newModel = Update.update message model

    -- expression is base64 encoded because firefox will change backslashes to regular slashes
    encode = Base64.encode >> Url.percentEncode

    regex = model.history.present.cachedRegex
      |> Maybe.map (Result.map (Build.constructRegexLiteral >> encode))

  in case regex of
    Just (Ok expression) -> (newModel, url ("?expression=" ++ expression))
    _ -> (newModel, url "")