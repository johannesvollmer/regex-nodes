module Main exposing (..)

import Browser
import Model
import Update
import View

main = Browser.sandbox
  { init = Model.init
  , update = Update.update
  , view = View.view
  }
