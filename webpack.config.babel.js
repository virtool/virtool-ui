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
      templateParameters: {
        backendURL: "http://localhost:9950",
      },
    }),
  ],
  ignoreWarnings: [{ message: /Unexpected console statement/ }],
  devServer: {
    hot: true,
    proxy: {
      "/api": "http://localhost:9950",
      "/websocket": {
        target: "ws://localhost:9950",
        ws: true,
        pathRewrite: {
          "^/websocket": "/ws",
        },
      },
    },
    historyApiFallback: true,
    port: 3000,
  },
};
