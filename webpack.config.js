// Import libs
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

// Import plugins
const HTMLWebpackPlugin = require("html-webpack-plugin");

// Import partial configurations
const cssExtract = require("./webpack-configs/css-extract");
const svgSprites = require("./webpack-configs/svg-sprites");
const importGlob = require("./webpack-configs/import-glob");
const devServer = require("./webpack-configs/dev-server");
const uglifyJS = require("./webpack-configs/uglifyJS");
const images = require("./webpack-configs/images");
const fonts = require("./webpack-configs/fonts");
const babel = require("./webpack-configs/babel");
const sass = require("./webpack-configs/sass");
const css = require("./webpack-configs/css");
const pug = require("./webpack-configs/pug");

// includePaths
const normalizePaths = "./node_modules/normalize-scss/sass";
const brigridPaths = require("brigrid").includePaths;
const bourbonPaths = require("bourbon").includePaths;
const SASSIncludePaths = [].concat(normalizePaths, brigridPaths, bourbonPaths);

/**
 * Paths
 * @type {Object}
 */
const PATHS = {
    src: path.join(__dirname, "src"),
    dist: path.join(__dirname, "dist"),
    assets: path.join(__dirname, "src/assets"),
};

/**
 * Common configuration
 * @type {Object}
 */
const common = merge([
    {
        entry: {
            index: path.resolve(PATHS.src, "index.js"),
        },
        output: {
            path: PATHS.dist,
            filename: "js/[name].[hash].js"
        },
        plugins: [
            new HTMLWebpackPlugin({
                filename: 'index.html',
                chunks: ['index', 'common'],
                template: path.resolve(PATHS.src, "index.pug")
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common'
            }),
            new webpack.ProvidePlugin({
                svgxuse: 'svgxuse',
                $: 'jquery',
                jQuery: 'jquery',
                'window.$': 'jquery',
                'window.jQuery': 'jquery'
            })
        ]
    },
    importGlob(),
    fonts([
        path.resolve(PATHS.assets, 'fonts')
    ]),
    svgSprites({
        icons: path.resolve(PATHS.assets, 'icons')
    }),
    babel(),
    pug(),
]);

var imagesPaths = [
    {
        input: path.resolve(PATHS.assets, 'images'),
        output: 'images/'
    },
    {
        input: path.resolve(__dirname, "node_modules/jquery-ui"),
        output: 'images/jquery-ui/'
    }
];

module.exports = function(env) {
    if (env === "production") {
        return merge([
            common,
            images(imagesPaths, true),
            cssExtract(SASSIncludePaths, true),
            uglifyJS(),
        ]);
    } else {
        return merge([
            common,
            devServer(),
            cssExtract(SASSIncludePaths, false),
            images(imagesPaths, false)
        ]);
    }
}
