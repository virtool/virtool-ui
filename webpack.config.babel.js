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

  node: {
    fs: "empty",
  },

  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },

  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "app.[hash:8].js",
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
    proxy: {
      '/api': 'http://localhost:9950',
      '/ws': {
       target: 'ws://localhost:9950',
       ws: true
    },
    },
    headers: {
     "Access-Control-Allow-Origin": "http://localhost:8080",
     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
     "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    historyApiFallback: true,
    port: 3000,
  },
  watch: true,
};
