port module Main exposing (..)

import Browser
import Build
import Model
import Update
import Url
import Url.Parser exposing (Parser)
import Url.Parser.Query
import View

port url : String -> Cmd msg


main = Browser.element
  { init = \flags -> (init flags, Cmd.none)
  , update = \message model -> update message model
  , subscriptions = always Sub.none
  , view = View.view
  }


{-main1 = Browser.sandbox
  { init = Model.initialValue |> Update.update -- cannot be done in Model due to circular imports
                (Update.SearchMessage <| Update.FinishSearch <| Update.ParseRegex "/\\s(?:the|for)/g")

  , update = Update.update
  , view = View.view
  }-}


init rawUrl =
  let
    expression = case String.split "?expression=" rawUrl of
      _ :: [ query ] -> Just (Debug.log "found query" query)
      _ -> Nothing

    escapedExpression = expression |> Maybe.andThen Url.percentDecode -- TODO does this include ?expression=
    regex = Debug.log "final expression" escapedExpression |> Maybe.withDefault "/\\s(?:the|for)/g"

  in
    Model.initialValue |> Update.update -- cannot be done in Model due to circular imports
      (Update.SearchMessage <| Update.FinishSearch <| Update.ParseRegex regex)

update message model =
  let
    newModel = Update.update message model
    regex = model.history.present.cachedRegex
      |> Maybe.map (Result.map Build.constructRegexLiteral)


  in case regex of
    Just (Ok expression) -> (newModel, url ("?expression=" ++ expression))
    _ -> (newModel, Cmd.none)
