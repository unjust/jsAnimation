const path = require('path');
const glob = require('glob');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// don't build lib files individually
const ignorePaths = ["./js/myLib/**/*.*js", "./js/libs/**/*.*js"];
ignorePaths.push("./js/archive/*.*js", "./js/utils/*.*js");

const pathPatterns = './js/**/*.*js';
const entryFiles = glob.sync(pathPatterns, { "ignore": ignorePaths });

// allows us to dynamically create file names
const entryConfig = entryFiles.reduce((config, item) => {
    const filename = path.basename(item);
    const name = filename.replace('.js', '');
    config[name] = item;
    return config;
}, {});

const buildPath = path.resolve(__dirname, 'build');
const jsBuildPath = path.resolve(__dirname, 'build/js');

const baseExports = {
    entry: entryConfig,
    output: {
        path: jsBuildPath,
        filename: `[name].js`
    },
    plugins: [
        new CleanWebpackPlugin([ buildPath ]),
        new CopyWebpackPlugin({ patterns: [{ from: 'img', to: `${buildPath}/img` }, { from: 'shaders', to: `${buildPath}/shaders` }] })
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
              test: path.resolve(__dirname, 'node_modules/p5/lib/addons/p5.sound.js'),
              use: "imports-loader?p5=>require('p5')"
            },
            {
              test: path.resolve(__dirname, 'node_modules/p5/lib/addons/p5.sound.min.js'),
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

module.exports = baseExports;
