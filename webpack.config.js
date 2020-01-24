const path = require('path');
const glob = require('glob');
const fs = require('fs');
const argv = require('argv');

const ARG_ARCHIVE = 'archive';
const ARG_FILEPATH = 'file';
const ARG_PROJECT = 'project';

argv.option([
    {
        name: ARG_ARCHIVE,
        short: 'a',
        default: true,
        type: 'boolean',
        description: 'Compile archive and utils too',
        example: "'yarn run webpack -a'"
    },
    {
        name: ARG_FILEPATH,
        short: 'f',
        type: 'string'
    },
    {
        name: ARG_PROJECT,
        short: 'p',
        type: 'csv,string',
        description: 'Compile js in the following dirs in projects',
        example: "'yarn run webpack -p objekt01,project03"
    }
]);

argv.info( `yarn run webpack to build js files, \n
    use -a to build archive and util dirs as well,
    use -f for an array of individual files (a little busted)` );

const argsOptions = argv.run().options;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// don't build lib files individually
const ignorePaths = ["./js/myLib/**/*.*js", "./js/libs/**/*.*js"];

let pathPatterns = './js/*.*js';

// don't build archive utils unless explicit
if (!argsOptions[ARG_ARCHIVE]) {
    // ignore archive and utils by default
    ignorePaths.push("./js/archive/*.*js", "./js/utils/*.*js");
}

if (argsOptions[ARG_FILEPATH]) { 
    pathPatterns = `./${argsOptions[ARG_FILEPATH]}`;
} 

if (argsOptions[ARG_PROJECT]) {
    (argsOptions[ARG_PROJECT]).forEach(
        (projectName) => pathPatterns.push(`./js/projects/${projectName}/*.*js`)
    );
}

const entryFiles = glob.sync(pathPatterns, { "ignore": ignorePaths });

// allows us to dynamically create file names
const entryConfig = entryFiles.reduce((config, item) => {
    const filename = path.basename(item);
    const name = filename.replace('.js', '');
    config[name] = item;
    return config;
}, {});

const noCanvasDOM = (entryName) => (entryName.indexOf('p5') > -1);

const buildPath = path.resolve(__dirname, 'build');
const jsBuildPath = path.resolve(__dirname, 'build/js');

const generateHtmlPluginCalls = () => {
    return  Object.keys(entryConfig).map((entryName, index) => {
        const date = new Date(fs.statSync(entryFiles[index]).ctime);
        const ctime = 
            `${date.getDate()}-${date.getMonth() < 12 ? date.getMonth() + 1 : 12}-${date.getFullYear()}`;
        const config = {
            chunks: [entryName],
            filename: `/${buildPath}/${entryName}.html`, // at root of build
            template: 'templates/template.html',
            title: `${entryName}`,
            noCanvasDOM: noCanvasDOM(entryName),
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

module.exports = {
    mode: 'development',
    watch: true,
    entry: entryConfig,
    output: {
        path: jsBuildPath,
        filename: `[name].js`
    },
    plugins: [
        new CleanWebpackPlugin([ buildPath ]),
        ...generateHtmlPluginCalls(),
        generateIndex(),
        new CopyWebpackPlugin([{ from: 'img', to: `${buildPath}/img` }])
    ],
    resolve: {
        alias: {
            Libraries: path.resolve(__dirname, './js/libs/'),
            Utils: path.resolve(__dirname, './js/utils/'),
            Framework: path.resolve(__dirname, './js/myLib/')
        }
    },
    module: {
        rules: [
            {
                test: path.resolve(__dirname, 'js/libs/easycam/p5.easycam.js'),
                use: "imports-loader?p5=>require('p5')"
            },
            {
                // https://webpack.js.org/guides/shimming/#global-exports
                test: path.resolve(__dirname, 'js/libs/easycam/p5.easycam.js'),
                use: 'exports-loader?createEasyCam=p5.prototype.createEasyCam,EasyCamLib=Dw'
            },
            {
                test: /\.js$/,
                exclude: /libs/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-proposal-class-properties'],
                    sourceMap: true
                }
            }
        ]
    }
};
