const path = require('path');
const glob = require('glob');
const fs = require('fs');
const yargs = require('yargs');

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ARG_ARCHIVE = 'archive';
const ARG_FILEPATH = 'file';

yargs.option(ARG_ARCHIVE, {
    alias: 'a',
    default: false,
    type: 'boolean',
    description: 'Compile archive and utils too',
    example: "'yarn run webpack -a'"
})

yargs.option(ARG_FILEPATH, {
    short: 'f',
    type: 'string'
});

yargs.usage( `yarn run webpack to build js files, \n
    use -a to build archive and util dirs as well,
    use -f for an array of individual files (a little busted)` );

// let argsOptions = {};
const argsOptions = yargs.argv;

if (argsOptions[ARG_ARCHIVE]) {
    console.log("Building the archive");
}

// don't build lib files individually
const ignorePaths = ["./js/myLib/**/*.*js", "./js/libs/**/*.*js"];

if (!argsOptions[ARG_ARCHIVE]) {
    // ignore archive and utils by default
    console.log("Ignoring the archive");
    ignorePaths.push("./js/archive/*.*js", "./js/utils/*.*js");
}

const pathPatterns = !(argsOptions[ARG_FILEPATH]) ? './js/**/*.*js' : `./${argsOptions[ARG_FILEPATH]}`;
const entryFiles = glob.sync(pathPatterns, { "ignore": ignorePaths });

// allows us to dynamically create file names
const entryConfig = entryFiles.reduce((config, item) => {
    const filename = path.basename(item);
    const name = filename.replace('.js', '');
    config[name] = item;
    return config;
}, {});

const isP5 = (entryName) => (entryName.indexOf('p5') > -1);

const buildPath = path.resolve(__dirname, 'build');

const generateHtmlPluginCalls = () => {
    return  Object.keys(entryConfig).map((entryName, index) => {
        const date = new Date(fs.statSync(entryFiles[index]).ctime);
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

const generateIndex = () => {
    const config = {
        chunks: [],
        filename: `/${buildPath}/index.html`,
        template: 'templates/index_page.html',
        title: `jsAnimation Index`,
        pages: Object.keys(entryConfig),
    };
    return new HtmlWebpackPlugin(config);
};

const devExports = merge(common, {
    entry: entryConfig,
    mode: 'development',
    watch: true,
    plugins: common.plugins.concat([
        ...generateHtmlPluginCalls(),
        generateIndex()
    ])
});
// console.log(common.entry, devExports.entry);
module.exports = devExports;
