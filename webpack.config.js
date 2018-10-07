var path = require('path');
var webpack = require('webpack');

module.exports = {
    mode: 'development',
    watch: true,
    entry: {
        first: './js/first.js'
    },
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