var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    vendor: ["react", "react-dom", "react-router"],
    app: ["babel-polyfill", "whatwg-fetch", "./src/index"]
  },
  output: {
    path: path.join(__dirname, "docs"),
    publicPath: "",
    filename: "./assets/[name].[hash].js",
    chunkFilename: "./assets/[name].[chunkhash].js"
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "src"),
        loader: "babel-loader",
        query: {
          presets: [
            ["es2015", { modules: false }],
            "stage-0",
            "react"
          ],
          plugins: [
            "transform-async-to-generator",
            "transform-decorators-legacy"
          ]
        }
      },
      {
        test: /\.scss|css$/i,
        use: [
          {loader: "style-loader", options: {sourceMap: true}},
          {loader: "css-loader", options: {sourceMap: true}},
          {loader: "postcss-loader", options: {sourceMap: true}},
          {loader: "resolve-url-loader", options: {sourceMap: true}},
          {loader: "sass-loader?sourceMap", options: {sourceMap: true}}
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader?hash=sha512&digest=hex&name=[hash].[ext]",
          {
            loader: "image-webpack-loader",
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
        drop_console: true,
        screw_ie8: true
      },
      output: {
        comments: false
      }
    }),
    new ExtractTextPlugin("assets/styles.css"),
    new HtmlWebpackPlugin({
      hash: false,
      template: "./index.hbs"
    })
  ]
};