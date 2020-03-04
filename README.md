![](https://github.com/actions/unjust/jsAnimation/workflows/Docs%20Workflow/badge.svg)
  
# JS animation

experiments with drawing and animation in js frameworks  
http://paperjs.org (haven't given paper too much love)  
https://p5js.org

Project is build with webpack, and using babel so I can use imports/exports and other es6 features :hooray:

## Structure

- `templates/` dir: 
contains a template for js (just as an example) 
and two templates for html that are used in the webpack build, [one that is used for p5 projects](https://github.com/unjust/jsAnimation/blob/master/templates/template_p5.html) because it doesnt require a canvas element in the dom (p5 makes a canvas), the other for paper js.

- `js/` dir: each sketch has its own file - using the extension \*.p5.js right now will generate an html file using the p5 template
  - `archive` dir: not a place for dead code! but for other finished projects
  - `utils` dir: for projects to visualize, debug etc
  - `myLib` dir: reusable code that I have written. Will build out to shapes, motions, etc
  - `libs` dir: for third party libs which need to be run through babel for module support
- `build/` dir: for built js (webpack/babel) and the generated html files

## Build process

`yarn run webpack` 

This will build just the js files in the root of js.

Options:  
`--archive` `-a` build the archive directory js
`--file` `-f` just build one file

webpack looks in the js directory,  
for every js it creates and entry point based on the file name  
(eg `first` for `first.js`, `foo` for `foo.js` etc) 

https://github.com/jantimon/html-webpack-plugin 
the the html plugin uses those entry points and creates an html file based on the appropriate html template in `templates/`.     
it appends the script tag to the bottom and interpolates basic template vars.

### Building docs

Every build creates a basic index file table of contents that can be seen on github docs.

To create an automated jekyll site, first run 
`yarn run ghpages` this will push out the compiled js to the ghpages branch in the site repo.
Uses the ghpages plugin https://github.com/tschaub/gh-pages

Then head over to https://github.com/unjust/unjustio to build the project.

run the command `yarn run ghpages` to push this remotely

run with `LOCAL=true yarn run ghpages` to push to unjustio gh-pages locally (this is done via the remote named local_docs which references unjustio on filesystem)


