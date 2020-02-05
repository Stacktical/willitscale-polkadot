/* eslint @typescript-eslint/no-var-requires: 0 */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',
  entry: [path.join(__dirname, 'src/main.ts')],
  externals: [nodeExternals({})],
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([{ from: 'src/prediction', to: '.' }])
  ]
});
