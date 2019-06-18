module Main exposing (..)

import Browser
import Model
import Update
import View

main = Browser.sandbox
  { init = Model.initialValue |> Update.update -- cannot be done in Model due to circular imports
      (Update.SearchMessage <| Update.FinishSearch <| Update.ParseRegex "/\\s(?:the|for)/g")

  , update = Update.update
  , view = View.view
  }
