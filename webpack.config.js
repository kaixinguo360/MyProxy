const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'
    }
  },
  entry: {
    'hook': './src/main.js',
    'hook-sw': './src/sw.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/proxy'),
    filename: '[name].js'
  },

  mode: 'development',
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
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

  devtool: 'eval-source-map',
  devServer: {
    port: 4200,
    publicPath: '/proxy/',
    historyApiFallback: true,
    inline: true,
    proxy: {
      context: (pathname) => !pathname.match("^/proxy/(main.js|sw.js)$"),
      target: 'http://localhost:8080/'
    }
  }
};
