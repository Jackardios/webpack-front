const path = require("path");
const nodeModulesPath = path.resolve( __dirname, "../node_modules" );

module.exports = function(paths, optimize = true) {
    let ruleForAssets = {
        test: /\.(jpe?g|png|gif|svg)$/i,
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
    };

    let ruleForVendor = {
        test: /\.(jpe?g|png|gif|svg)$/i,
        include: nodeModulesPath,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 4096,
                    name: '[name]_[hash].[ext]',
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
