const webpack = require('webpack')
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ["transform-object-rest-spread"],
            presets: ['es2015', 'react']
          }
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: (webpack) => [
          // require('postcss-import')({ addDependencyTo: webpack }),
          // require('postcss-url')(),
          require('postcss-cssnext')(),
          require('postcss-nesting'),
          // and if you want to compress,
          // just use css-loader option that already use cssnano under the hood
          require('postcss-browser-reporter')(),
          require('postcss-reporter')(),
        ]
      }
    })
  ]
}