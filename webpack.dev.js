const path = require('path');
const glob = require('glob');
const fs = require('fs');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ARG_ARCHIVE = 'archive';

// don't build lib files individually
const ignorePaths = ["./js/myLib/**/*.*js", "./js/libs/**/*.*js"];

const pathPatterns = './js/**/*.*js';
const entryFiles = (includeArchive=false) => glob.sync(pathPatterns, { "ignore": (includeArchive ? ignorePaths : [...ignorePaths, "./js/archive/*.*js", "./js/utils/*.*js"]) });

// allows us to dynamically create file names
const entryConfig = (includeArchive=false) => entryFiles(includeArchive).reduce((config, item) => {
    const filename = path.basename(item);
    const name = filename.replace('.js', '');
    config[name] = item;
    return config;
}, {});

const isP5 = (entryName) => (entryName.indexOf('p5') > -1 || entryName.indexOf('three') > -1);

const buildPath = path.resolve(__dirname, 'build');

const generateHtmlPluginCalls = (includeArchive=false) => {
    return Object.keys(entryConfig(includeArchive)).map((entryName, index) => {
        const date = new Date(fs.statSync(entryFiles(includeArchive)[index]).ctime);
        const ctime = 
            `${date.getDate()}-${date.getMonth() < 12 ? date.getMonth() + 1 : 12}-${date.getFullYear()}`;
        const noCanvasDOM = isP5(entryName); // if p5 don't add canvas
        const config = {
            chunks: [entryName],
            filename: `/${buildPath}/${entryName}.html`, // at root of build
            template: 'templates/template.html',
            title: `${entryName}`,
            noCanvasDOM,
            ctime
        };
        return new HtmlWebpackPlugin(config);
    });
};

const generateIndex = (includeArchive=false) => {
  const pages = Object.keys(entryConfig(includeArchive));
  const config = {
      chunks: [],
      filename: `/${buildPath}/index.html`,
      template: 'templates/index_page.html',
      title: `jsAnimation Index`,
      pages,
  };
  return new HtmlWebpackPlugin(config);
};

const devExports = (env) => merge(common, {
    entry: entryConfig(env[ARG_ARCHIVE]),
    mode: 'development',
    watch: true,
    plugins: common.plugins.concat([
        ...generateHtmlPluginCalls(env[ARG_ARCHIVE]),
        generateIndex(env[ARG_ARCHIVE])
    ])
});
// console.log(common.entry, devExports.entry);

https://webpack.js.org/guides/environment-variables/
module.exports = (env) => devExports(env);
