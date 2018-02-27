const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function() {
    return {
        plugins: [
            new UglifyJSPlugin({
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    ecma: 8,
                    compress: {
                        warnings: false
                    },
                    output: {
                        comments: false
                    }
                }
            })
        ]
    };
};