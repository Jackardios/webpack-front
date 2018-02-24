const path = require("path");
const nodeModulesPath = path.resolve( __dirname, "../node_modules" );

module.exports = function (paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.(ttf|eot|woff2?|svg)$/,
                    include: paths,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                name: '[path][name]_[hash].[ext]',
                            },
                        }
                    ]
                },
                {
                    test: /\.(ttf|eot|woff2?|svg)$/,
                    include: nodeModulesPath,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                outputPath: 'vendor/',
                                name: '[name]_[hash].[ext]',
                            },
                        }
                    ]
                },
            ]
        }
    };
}