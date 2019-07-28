port module Main exposing (..)

import Browser
import Model
import Update
import Url
import Url.Parser exposing (Parser)
import Url.Parser.Query
import View

port url : String -> Cmd msg


{-main1 = Browser.sandbox
  { init = Model.initialValue |> Update.update -- cannot be done in Model due to circular imports
                (Update.SearchMessage <| Update.FinishSearch <| Update.ParseRegex "/\\s(?:the|for)/g")

  , update = Update.update
  , view = View.view
  }-}


init rawUrl =
  let
    queryParser: Url.Parser.Parser (Maybe String -> a) a
    queryParser = Debug.log "parser" (Url.Parser.Query.string "expression" |> Url.Parser.query)

    extractExpression: Url.Url -> Maybe String
    extractExpression urrl = Debug.log "parsed query" (Url.Parser.parse queryParser urrl) |> unwrap

    expression = Debug.log "parsed url" (Url.fromString (Debug.log "raw" rawUrl)) |> Maybe.andThen extractExpression
    regex = Debug.log "final expression" expression |> Maybe.withDefault "/\\s(?:the|for)/g"

  in
    Model.initialValue |> Update.update -- cannot be done in Model due to circular imports
      (Update.SearchMessage <| Update.FinishSearch <| Update.ParseRegex regex)


main = Browser.element
  { init = \flags -> passive (init flags)
  , update = \message model -> passive (Update.update message model)
  , subscriptions = always Sub.none
  , view = View.view
  }


passive value = (value, Cmd.none)

unwrap: Maybe (Maybe a) -> Maybe a
unwrap = Maybe.withDefault Nothing