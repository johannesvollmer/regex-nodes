# Regex Nodes

Node based regular expression editor! 
It helps you understand and construct regular expressions for use in Javascript.
If your regular expressions are complex enough to give this editor relevance, you probably shouldn't use regular expressions.

# Check it out

[This website is hosted on github pages](https://johannesvollmer.github.io/regex-nodes/).


# Build

With elm installed on your system, run `elm make src/Main.elm --output=html/built.js`.
Also, see [compiling elm with optimization enabled](https://elm-lang.org/0.19.0/optimize).

Alternatively, use [modd](https://github.com/cortesi/modd) in this directory to compile on every file save.


# Shoutout

[![BrowserStack Logo](/readme/browser-stack.png?raw=true "BrowserStack")](https://www.browserstack.com/)

Thanks to BrowserStack, we can make sure this website runs on any browser, for free. 
BrowserStack loves Open Source, and Open Source loves BrowserStack.


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
- [x] Middle mouse button view movement
    - [ ] Blur text input on non-middle-mouse-clicking anywhere
- [ ] Simplify UX of changing order in "Set Node"s
- [x] Tooltips
    - [ ] Custom, styled tooltips?
- [ ] Live Explanations!!
- [ ] Reconnect replaced connections 
      when reverting connection prototype
- [x] Instantiate Nodes centered to the screen
    - [ ] Using the real window size
- [ ] Consider rewriting Css to Sass
- [ ] Node Groups!
