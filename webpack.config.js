const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

// allows us to dynamically create file names
const entryFiles = glob.sync('./js/**/*.*js');
const entryConfig = entryFiles.reduce((config, item) => {
    const filename = path.basename(item);
    const name = filename.replace('.js', '');
    config[name] = item;
    return config;
}, {});

module.exports = {
    mode: 'development',
    watch: true,
    entry: entryConfig,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: `[name].js`
    },
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