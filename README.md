# Regex Nodes

This is the elm rewrite of the [regex-nodes prototype](https://github.com/johannesvollmer/regex-nodes-js).
Currently almost usable.


# Check it out

[This website is hosted on github pages](https://johannesvollmer.github.io/regex-nodes/).


# Build

With elm installed on your system, run `elm make src/Main.elm --output=html/built.js`.
Also, see [compiling elm with optimization enabled](https://elm-lang.org/0.19.0/optimize).

Alternatively, use [modd](https://github.com/cortesi/modd) in this directory to compile on every file save.


# To Do
- [x] Example text for instant feedback
- [x] Implement all node types
- [x] Automatic node width calculation
- [ ] Initial node setup for an easy start
- [x] Build Scripts + Build to Github Pages
    - [x] Use optimized builds instead of debug builds for github pages
- [ ] Parse regex code in "Add Nodes"
- [x] How to delete nodes
    - [ ] When deleting a node, try to retain connections 
          (If the deleted node is a single property node, connect the otherwise now opened connections)
- [x] Do not adjust example for every node move
- [ ] Middle mouse button view movement
- [ ] Simplify UX of changing order in "Set Node"s
- [ ] Tooltips and explanations!!
- [ ] Reconnect replaced connections 
      when reverting connection prototype
- [ ] Instantiate Nodes centered to the screen
- [ ] Consider rewriting Css to Sass
- [ ] Node Groups!