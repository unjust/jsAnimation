# paperJS
experiments with paperJS drawing and animation

Going to work through some ideas and tutorials with http://paperjs.org/

Project is build with webpack, using babel so I can use imports/exports and other es6 features :hooray:

## Structure

- templates: contains a template for js (just as an example) and a template for html that is used in the webpack build.
- js: each sketch has its own file
- build: dir for built js (webpack/babel) and generated html files

## Build process

`yarn run webpack` 

webpack looks in the js directory, for every js it creates and entry point based on the file name  
(eg `first` for `first.js`, `foo` for `foo.js` etc) 

https://github.com/jantimon/html-webpack-plugin
the the html plugin uses those entry points and creates an html file based on the `templates/template.html`. 
it appends the script tag to the bottom and interpolates basic template vars.
