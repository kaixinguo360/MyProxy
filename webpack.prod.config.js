const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: [
    './app/hook.js',
  ],
  output: {
    path: path.resolve(__dirname, 'dist/proxy/hook'),
    filename: 'hook.js'
  },

  mode: 'production',
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
    new CleanWebpackPlugin()
  ],
  optimization: {
    nodeEnv: 'production'
  }
};
