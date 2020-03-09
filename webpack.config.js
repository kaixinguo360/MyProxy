const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    'hook': './app/main.js',
    'hook-sw': './app/sw.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/proxy'),
    filename: '[name].js'
  },

  mode: 'development',
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      { test: /\.m?js$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/, use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          }
        },
        { loader: 'postcss-loader' }
      ]}
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
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
