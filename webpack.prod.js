const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const newExports = merge( common, {
  mode: 'production'
});

module.exports = newExports;
