module.exports = function(paths, optimize = true) {
    let ruleForAssets = {
        test: /\.(jpe?g|png|gif|svg)$/i,
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
    };

    let ruleForVendor = {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: '/node_modules/',
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 4096,
                    name: '[path][name].[ext]',
                },
            }
        ]
    };
    
    if (optimize) {
        ruleForAssets.use.push({
            loader: 'image-webpack-loader'
        });
        ruleForVendor.use.push({
            loader: 'image-webpack-loader'
        });
    }

    return {
        module: {
            rules: [
                ruleForAssets,
                ruleForVendor,
            ]
        }
    };
}
