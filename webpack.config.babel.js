const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          "babel-loader",
          {
            loader: "eslint-loader",
            options: {
              configFile: path.resolve(__dirname, "./.eslintrc"),
            },
          },
        ],
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  devtool: "source-map",

  resolve: {
    fallback: {
    	fs: false,
    },
  },

  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },

  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "app.[contenthash:8].js",
  },

  mode: "development",

  plugins: [
    new CleanWebpackPlugin(),

    new HTMLWebpackPlugin({
      filename: "index.html",
      title: "Virtool",
      favicon: path.resolve(__dirname, "./src/images/favicon.ico"),
      template: path.resolve(__dirname, "./src/index.html"),
      inject: "body",
    }),
  ],
  devServer: {
  client: {
      webSocketURL: 'ws://localhost:9950/ws',
    },
    proxy: {
      '/api': 'http://localhost:9950',
    },
    headers: {
     "Access-Control-Allow-Origin": "http://localhost:8080",
     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
     "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    historyApiFallback: true,
    port: 3000,
  },
};
