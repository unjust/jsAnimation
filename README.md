
  
# JS animation

Experiments with drawing and animation in js frameworks:  
http://paperjs.org (haven't given paper too much love)  
https://p5js.org
three js could have a home here too

Project is built with webpack and using babel so I can use imports/exports and other es6 features :hooray:

## Starting a project

Branch off of the `project_base` branch which will not contain any animation js, just the tools templates and build process.

`master` contains animation projects - both the latest animation and archived animation.

## Structure

- `templates/` dir: 
contains a templates for js and html
The js is meant to be used as an example of a p5 project and non-p5. 
The two templates for html that are used in the webpack build, [one that is used for p5 projects](https://github.com/unjust/jsAnimation/blob/master/templates/template_p5.html) because it doesnt require a canvas element in the dom (p5 makes a canvas), the other for paper js.

- `js/` dir: each sketch has its own file - using the extension \*.p5.js right now will generate an html file using the p5 template when the project is built
  - `archive` dir: not a place for dead code! but for other finished projects
  - `utils` dir: for projects to visualize, debug etc
  - `myLib` dir: reusable code that I have written. Will build out to shapes, motions, etc
  - `libs` dir: for third party libs which need to be run through babel for module support
- `build/` dir: for built js (webpack/babel) and the generated html files

## Build process

There are now separate webpack configs for dev and prod.
dev builds everything and starts to watch the files.
prod configured more to just compile the js.

### `yarn run dev`

`yarn run dev`. 
This will build the js files in the root of js (not archive or utils).
And will also start watching the files.

webpack looks in the js directory,  
for every js it creates and entry point based on the file name  
(eg `first` for `first.js`, `foo` for `foo.js` etc) 

https://github.com/jantimon/html-webpack-plugin 
the the html plugin uses those entry points and creates an html file based on the appropriate html template in `templates/`.     
it appends the script tag to the bottom and interpolates basic template vars.

You can also build with options**:  
  `--archive` `-a` build the archive directory js 
  `--file` `-f` just build one file 

** this feature needs to be checked and tested

### `yarn run build_js`

Just builds the compiled js. 
Used by the build_push_to_site.workflow. 
to share the compiled js to the jekyll site.  

### Building docs

Every build creates a basic index file in the master branch that is a table of contents and can be seen here on github docs.

To push compiled js files to the jekyll site to then be used on the site there, you can run 
`yarn run ghpages` 

which will push out the compiled js of whatever branch you are on to the ghpages branch in the site repo.

Run the command `yarn run ghpages` to push these files remotely. 
Run with `LOCAL=true yarn run ghpages` to push to unjustio gh-pages locally (this is done via the remote named local_docs which references unjustio on filesystem)

The script is [here](https://github.com/unjust/jsAnimation/blob/master/build_docs.js) 
Uses the ghpages plugin https://github.com/tschaub/gh-pages

Then head over to https://github.com/unjust/unjustio to build the project.




