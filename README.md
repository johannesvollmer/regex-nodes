# Regex Nodes

[This node-based regular expression editor](https://johannesvollmer.github.io/regex-nodes/) 
helps you understanding and editing regular expressions for use in Javascript.
If your regular expressions are complex enough to give this editor relevance, 
you probably shouldn't use regular expressions, haha.

# Why Nodes?

One of the problems with regular expressions is
that they get quite messy very quickly. Operator 
precedence is not always obvious and can be misleading.
Nodes are a visual hierarchy in contrast to a line of text,
which cannot simply be broken into several lines or indented, 
because that would alter the meaning of the expression.
Nodes can be rearranged however you like.

Also, Nodes offer various other advantages, such as
reusing, grouping and parameterizing expressions, 
and automatic optimizations.


# Build 

With elm installed on your system, run 
`elm make src/Main.elm --output=html/built.js`. Also, see 
[compiling elm with optimization enabled](https://elm-lang.org/0.19.0/optimize).

Alternatively, use [modd](https://github.com/cortesi/modd) 
in this directory to compile on every file save.


# Shoutout

[![BrowserStack Logo](/readme/browser-stack.png?raw=true "BrowserStack")](https://www.browserstack.com/)

Thanks to BrowserStack, we can make sure this website runs on any browser, for free. 
BrowserStack loves Open Source, and Open Source loves BrowserStack.


# To Do
- [ ] Add automated tests
- [x] Example text for instant feedback
- [x] Implement all node types
- [x] Automatic node width calculation
- [x] Initial node setup for an easy start
    - [x] After improving parsing, add a more interesting start setup
- [x] Build Scripts + Build to Github Pages
    - [x] Use optimized builds instead of debug builds for github pages
- [ ] Use node width and property count when layouting parsed nodes
- [x] Parse regex code in "Add Nodes"
    - [x] Charset `[abc]`
        - [ ] Char ranges `[a-bc-d][^a-b]`
    - [x] Alternation `(a|b)`
    - [x] Escaped Characters `\W`
        - [ ] Unicode literals? `\x01`
    - [x] Sequences `the( |_)`
    - [x] Look Ahead `a(?!b)`
    - [x] Quantifiers `a?b{0,3}`
        - [x]  `a?b??c+?d*?`
        - [ ]  `b{0,3}c{1,}d{5}`
    - [x] Positioning `(^, $)`
- [x] How to delete nodes
    - [ ] Option: Delete with children
    - [ ] Option: When deleting a node, try to retain connections 
          (If the deleted node is a single property node, 
          connect the otherwise now opened connections)
- [x] Do not adjust example for every node move
- [x] Middle mouse button view movement
    - [x] Blur text input on non-middle-mouse-clicking anywhere
- [ ] Simplify UX of changing order in "Set Node"s
- [x] Prevent cyclic connections
- [x] Tooltips
    - [ ] Custom, styled tooltips?
- [ ] Live Explanations!!
- [ ] Move node including all input nodes?
- [ ] Iterative Auto-layout using physics simulation?
- [ ] Reconnect replaced connections 
      when reverting connection prototype
- [x] Instantiate Nodes centered to the screen
    - [ ] Using the real window size
- [ ] Consider rewriting Css to Sass
- [ ] On input focus select container node
- [ ] Node Groups!
