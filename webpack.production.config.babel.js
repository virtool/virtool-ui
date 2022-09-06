const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: ["babel-loader"],
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
    fallback: {
      fs: false,
    },
  },

  mode: "production",

  optimization: {
    minimizer: [new TerserWebpackPlugin()],
    splitChunks: {
      chunks: "all",
    },
  },

  devtool: "source-map",

  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "app.[contenthash:8].js",
    sourceMapFilename: "[name].js.map",
  },

  plugins: [
    new ESLintPlugin({
      overrideConfigFile: path.resolve(__dirname, "./.eslintrc"),
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),

    new HTMLPlugin({
      filename: "index.html",
      title: "Virtool",
      favicon: "./src/images/favicon.ico",
      template: "./src/index.html",
      inject: "body",
    }),

    new CleanWebpackPlugin(),
  ],
};
