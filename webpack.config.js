const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = (env, options) => {
  const isDevMode = options.mode !== "production";

  const commonConfig = {
    entry: "./src/scripts/app.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "app" + (isDevMode ? ".js" : ".min.js")
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: !isDevMode }
            }
          ]
        }
      ]
    },
    plugins: [new CleanWebpackPlugin(["build"])]
  };

  const devConfig = {
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebPackPlugin({
        filename: "index.html",
        template: "./src/index.html"
      })
    ],
    devtool: "source-map",
    devServer: {
      hot: true,
      compress: true,
      port: 9000
    }
  };

  const productionConfig = {
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin({})],
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            enforce: true
          }
        }
        // chunks: "all"
      }
    },
    plugins: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: true,
            drop_console: true
          },
          output: {
            comments: false
          }
        },
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  };

  return isDevMode
    ? merge(commonConfig, devConfig)
    : merge(commonConfig, productionConfig);
};
