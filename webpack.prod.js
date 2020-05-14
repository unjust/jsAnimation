const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const dev = require('./webpack.dev.js');

const newExports = merge( common, dev, {
  mode: 'production',
  watch: false
});

module.exports = newExports;
