const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    'hook': './src/main.js',
    'hook-sw': './src/sw.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/proxy'),
    filename: '[name].js'
  },

  mode: 'production',
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.ts$/, exclude: /node_modules/, use: 'ts-loader' },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'postcss-loader' }
      ]}
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  optimization: {
    nodeEnv: 'production'
  }
};
