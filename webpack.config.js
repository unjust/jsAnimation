const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entryFiles = glob.sync('./js/**/*.*js');

// allows us to dynamically create file names
const entryConfig = entryFiles.reduce((config, item) => {
    const filename = path.basename(item);
    const name = filename.replace('.js', '');
    config[name] = item;
    return config;
}, {});

const template = 'templates/template.html';
const generateHtmlPluginCalls = () => {
    return Object.keys(entryConfig).map((entryName, index) => {
       const config = {
            chunks: [entryName],
            filename: `${entryName}.html`,
            template,
            title: `${entryName} Paper`
        };
        return new HtmlWebpackPlugin(config);
    });
    // console.log(arr);
    // return arr;
};

module.exports = {
    mode: 'development',
    watch: true,
    entry: entryConfig,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: `[name].js`
    },
    plugins: generateHtmlPluginCalls(),
    module: {
        rules: [ 
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    }
};