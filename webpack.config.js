const path = require('path');
const glob = require('glob');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
        const date = new Date(fs.statSync(entryFiles[index]).ctime);
        const ctime = `${date.getDate()}\
        -${date.getMonth() < 12 ? date.getMonth() + 1 : 12}\
        -${date.getFullYear()}`;
        const config = {
            chunks: [entryName],
            filename: `${entryName}.html`,
            template,
            title: `${entryName} Paper`,
            ctime
        };
        return new HtmlWebpackPlugin(config);
    });
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
        ...generateHtmlPluginCalls(),
        new CopyWebpackPlugin([{ from: 'img', to: `${buildPath}/img` }])
    ],
    module: {
        rules: [ 
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    sourceMap: true
                }
            }
        ]
    }
};