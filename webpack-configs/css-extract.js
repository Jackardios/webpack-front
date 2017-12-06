const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer');
const cssNano = require('cssnano');
const cssMqpacker = require('css-mqpacker');

module.exports = function(sassPaths, optimize = true) {
    var postCSS = {
        loader: 'postcss-loader',
        options: {
            plugins: [
                autoprefixer(),
                cssMqpacker({
                    sort: true
                }),
                cssNano({
                    reduceIdents: false,
                    discardComments: {
                        removeAll: true
                    }
                })
            ]
        }
    };
    
    var sassLoader = {
        loader: 'sass-loader',
        options: { includePaths: sassPaths }
    };

    var baseUse = ['css-loader'];

    if (optimize) {
        baseUse.push(postCSS);
    }

    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        publicPath: '../',
                        fallback: 'style-loader',
                        use: baseUse
                    })
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        publicPath: '../',
                        fallback: 'style-loader',
                        use: baseUse.concat(sassLoader)
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('./css/[name].[hash].css')
        ]
    };
}
