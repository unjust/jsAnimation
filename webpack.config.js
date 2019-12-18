const path = require('path');
const glob = require('glob');
const fs = require('fs');
const argv = require('argv');

const ARG_ARCHIVE = 'archive';
const ARG_FILE = 'file';

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
        name: ARG_FILE,
        short: 'f',
        type: 'csv,string'
    }
]);

argv.info( `yarn run webpack to build js files, \n
    use -a to build archive and util dirs as well,
    use -f for an array of individual files (a little busted)` );

const argsOptions = argv.run().options;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ignoreOptions = (argsOptions[ARG_ARCHIVE]) ? null : 
    { "ignore": ["./js/archive/*.*js", "./js/utils/*.*js"] } ;
const pathPatterns = !(argsOptions[ARG_FILE]) ? '*.*js' :
    '*(' + (argsOptions[ARG_FILE]).reduce((acc, path) => `${acc}|${path}`) + ')';

const entryFiles = glob.sync(`./js/**/${pathPatterns}`, ignoreOptions);

// allows us to dynamically create file names
const entryConfig = entryFiles.reduce((config, item) => {
    const filename = path.basename(item);
    const name = filename.replace('.js', '');
    config[name] = item;
    return config;
}, {});


const noCanvasDOM = (entryName) => (entryName.indexOf('p5') > -1);

const generateHtmlPluginCalls = () => {
    return  Object.keys(entryConfig).map((entryName, index) => {
        const date = new Date(fs.statSync(entryFiles[index]).ctime);
        const ctime = 
            `${date.getDate()}-${date.getMonth() < 12 ? date.getMonth() + 1 : 12}-${date.getFullYear()}`;
        const config = {
            chunks: [entryName],
            filename: `${entryName}.html`,
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
        filename: `index.html`,
        template: 'templates/index_page.html',
        title: `jsAnimation Index`,
        pages: Object.keys(entryConfig),
    };
    return new HtmlWebpackPlugin(config);
};

const buildPath = path.resolve(__dirname, 'build');

module.exports = {
    mode: 'development',
    watch: true,
    entry: entryConfig,
    output: {
        path: buildPath,
        filename: `[name].js`
    },
    plugins: [
        new CleanWebpackPlugin([ buildPath ]),
        ...generateHtmlPluginCalls(),
        generateIndex(),
        new CopyWebpackPlugin([{ from: 'img', to: `${buildPath}/img` }])
    ],
    module: {
        rules: [ 
            {
                test: /\.js$/,
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
