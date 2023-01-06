const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: /src\/js/,
        use: ["ts-loader"],
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

  devtool: "source-map",

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
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
    new ESLintPlugin({
      overrideConfigFile: path.resolve(__dirname, "./.eslintrc"),
    }),
    new HTMLWebpackPlugin({
      filename: "index.html",
      title: "Virtool",
      favicon: path.resolve(__dirname, "./src/images/favicon.ico"),
      template: path.resolve(__dirname, "./src/index.html"),
      inject: "body",
    }),
  ],
  ignoreWarnings: [{ message: /Unexpected console statement/ }],
  devServer: {
    allowedHosts: "all",
    client: {
      webSocketURL: {
        hostname: "localhost",
        pathname: "/ws",
        port: 9900,
        protocol: "ws",
      },
    },
    historyApiFallback: true,
    host: "0.0.0.0",
    hot: true,
    port: 9900,
  },
};
