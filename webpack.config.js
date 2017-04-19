const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: 'main.css',
  disable: process.env.NODE_ENV === "development"
})

module.exports = {
  entry: './src/settings.js',
  output: {
    path: path.resolve(__dirname, '.'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader'},
      { test: /\.scss$/, use: extractSass.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],
        fallback: "style-loader"
      })}
    ]
  },
  plugins: [
    extractSass,
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
  devServer: {
    contentBase: path.join(__dirname, '.'),
    historyApiFallback: true,
    publicPath: "/dist/",
    port: 8080
  },
  devtool: 'cheap-eval-source-map',
  node: {
    fs: 'empty'
  }
}
