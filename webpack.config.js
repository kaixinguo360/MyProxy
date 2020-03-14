const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    'hook': './src/main.ts',
    'hook-sw': './src/sw.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist/proxy'),
    filename: '[name].js'
  },

  mode: 'development',
  module: {
    rules: [
      { test: /\.txt$/, loader: 'raw-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader', options: { appendTsSuffixTo: [/\.vue$/] } },
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
    alias: { 'vue$': 'vue/dist/vue.esm.js' },
    extensions: [ '.ts', '.js' ]
  },

  devtool: 'eval-source-map',
  devServer: {
    port: 4200,
    publicPath: '/proxy/',
    historyApiFallback: true,
    inline: true,
    proxy: {
      context: (pathname) => !pathname.match("^/proxy/(main.ts|sw.ts)$"),
      target: 'http://localhost:8080/'
    }
  }
};
