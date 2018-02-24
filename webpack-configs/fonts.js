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
                                name: '[path][name].[ext]',
                            },
                        }
                    ]
                },
                {
                    test: /\.(ttf|eot|woff2?|svg)$/,
                    include: /node_modules/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 4096,
                                outputPath: 'vendor/',
                                name: '[path][name].[ext]',
                            },
                        }
                    ]
                },
            ]
        }
    };
}