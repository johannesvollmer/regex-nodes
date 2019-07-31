# Regex Nodes

[This node-based regular expression editor](https://johannesvollmer.github.io/regex-nodes/) 
helps you understand and edit regular expressions for use in your Javascript code.

> If your regular expressions are complex enough to give this editor relevance, 
> you probably should consider not using regular expressions, haha.

# Why Nodes?

One of the problems with regular expressions is
that they get quite messy very quickly. Operator 
precedence is not always obvious and can be misleading.
Nodes, on the other hand, are a visual hierarchy. A text-based regex
cannot simply be broken into several lines or indented, 
because that would alter the meaning of the expression. 

The other major benefit of nodes is that the editor will prevent you from
producing invalid expressions. Other regex editors analyze the possibly incorrect
regular expression that the user has come up with. The node editor will
allow you to enter your intention and generate a correct regular expression.

In addition, nodes offer various other advantages, such as
reusing subexpressions, automatic character escaping, grouping and parameterizing expressions, 
and automatic optimizations.


# Core Features
- Construct regular expressions using a visual editor
- Load existing regular expressions from your Javascript code into the editor and edit it utilizing nodes
- Use the generated expression in Javascript
- See effects of the regular expression live using a customizable example text
- Coming Soon: Reuse common patterns to not spend time reinventing the regex wheel


# How to use

See [this blog post](https://johannesvollmer.github.io/2019/announcing-regex-nodes/).
It explains how to handle the nodes and what the buttons do.

# Build 

With elm installed on your system, run 
`elm make src/Main.elm --output=html/built.js`. Also, see 
[compiling elm with optimization enabled](https://elm-lang.org/0.19.0/optimize).

Alternatively, use [modd](https://github.com/cortesi/modd) 
in this directory to compile on every file save.


# Roadmap
1. As I have realized that node groups would not be worth development time
   right now, the editor should offer common regex patterns as hard-coded nodes.
   When parsing a regular expression, those patterns should be recognized.
2. To fully quality as an editor, the parser must support repetition ranges in curly 
   braces and Unicode literals at all costs.
3. Simply connecting and rearranging properties of set nodes and sequence nodes.
   

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
- [x] Use node width and property count when layouting parsed nodes
      Or use iterative physics approach (force-directed layout)
- [ ] While in "Add Nodes", press enter to pick the first option
- [x] Parse regex code in "Add Nodes"
    - [x] Charset `[abc]`
        - [x] Char ranges `[a-bc-d][^a-b]`
        - [ ] Fix composed negation being ignored
    - [x] Alternation `(a|b)`
    - [x] Escaped Characters `\W`
        - [ ] Unicode literals? `\x01`
    - [x] Sequences `the( |_)`
    - [x] Look Ahead `a(?!b)`
    - [x] Quantifiers `a?b{0,3}`
        - [x]  `a?b??c+?d*?`
        - [x]  `b{0,3} c{1,} d{5}`
    - [x] Positioning `(^, $)`
- [x] How to delete nodes
    - [ ] Option: Delete with children
    - [ ] Option: When deleting a node, try to retain connections 
          (If the deleted node is a single property node, 
          connect the otherwise now opened connections)
- [x] Do not adjust example for every node move
- [x] Middle mouse button view movement
    - [x] Blur text input on non-middle-mouse-clicking anywhere
- [x] Simplify UX of changing order in "Set Node"s
- [x] Prevent cyclic connections
- [x] Tooltips
    - [ ] Custom, styled tooltips?
- [ ] Live Explanations!!
- [ ] Move node including all input nodes? (Next to duplicate and delete)
- [ ] Iterative Auto-layout using physics simulation?
- [ ] Reconnect replaced connections 
      when reverting connection prototype
- [x] Instantiate Nodes centered to the screen
    - [ ] Using the real window size
- [ ] Consider rewriting Css to Sass
- [ ] On input focus select container node
- [ ] Premade Reusable Node Patterns!
    - [ ] UX: A node, which by default is collapsed, and on click 
          reveals all connected nodes which are otherwise hidden
          (Think of it more like a section in a wiki which is summarized by the header)
- [ ] Unicode in the output regex
- [ ] Unicode literal node?
- [ ] Support mobile devices
- [x] Enable sharing node graphs by url?
    - [ ] Do not always update URI, but only when user wants to share?
- [ ] Reset view button when panned too far away
- [x] Deduplicate parsed node graph
- [ ] Turn this whole project into a NodeJS monster just for testing and minification of the generated javascript.... or wait until a better solution arrives. 
- [ ] If the example text is short, center it to the screen 