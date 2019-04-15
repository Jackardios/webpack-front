const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const postcssNormalize = require('postcss-normalize');

const PATHS = {
  src: path.resolve(__dirname, 'src'),
  build: path.resolve(__dirname, 'build'),
};

module.exports = (env, options) => {
  const isDevMode = options.mode !== 'production';

  const commonConfig = {
    entry: path.join(PATHS.src, 'scripts/app.js'),
    output: {
      path: PATHS.build,
      filename: 'app' + (isDevMode ? '.js' : '.min.js'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          enforce: 'pre',
          test: /\.(js|s?[ca]ss)$/,
          include: PATHS.src,
          loader: 'import-glob',
        },
        {
          test: /\.(ttf|otf|eot|woff2?|png|jpe?g|gif|svg|ico)$/,
          include: PATHS.src,
          loader: 'url-loader',
          options: {
            limit: 2048,
            name: '[name].[ext]',
            useRelativePath: true,
            outputPath: 'images/',
          },
        },

        {
          test: /\.(ttf|otf|eot|woff2?|png|jpe?g|gif|svg|ico)$/,
          include: /node_modules/,
          loader: 'url-loader',
          options: {
            limit: 2048,
            outputPath: 'vendor/',
            name: '[name].[ext]',
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: false },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin({
        filename: 'index.html',
        template: path.join(PATHS.src, 'index.html'),
      }),
    ],
    externals: {
      jquery: 'jQuery',
    },
  };

  const devConfig = {
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devtool: 'source-map',
    devServer: {
      hot: true,
      compress: true,
      port: 9000,
    },
  };

  const productionConfig = {
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebook/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                  // Adds PostCSS Normalize as the reset css with default options,
                  // so that it honors browserslist config in package.json
                  // which in turn let's users customize the target behavior as per their needs.
                  postcssNormalize(),
                ],
                sourceMap: true,
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 75,
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: '75-90',
                  speed: 4,
                },
                gifsicle: {
                  interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75,
                },
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              warnings: true,
              drop_console: true,
            },
            output: {
              comments: false,
            },
          },
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessor: require('cssnano'),
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
        }),
      ],
      // splitChunks: {
      //   cacheGroups: {
      //     styles: {
      //       name: 'styles',
      //       test: /\.css$/,
      //       chunks: 'all',
      //       enforce: true,
      //     },
      //   },
      //   // chunks: "all"
      // },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'app' + (isDevMode ? '.css' : '.min.css'),
      }),
    ],
  };

  return isDevMode
    ? merge(commonConfig, devConfig)
    : merge(commonConfig, productionConfig);
};
