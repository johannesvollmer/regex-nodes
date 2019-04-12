module Main exposing (..)

import Browser
import Model exposing (init)
import Update exposing (update)
import View exposing (view)

main = Browser.sandbox { init = init, update = update, view = view }
