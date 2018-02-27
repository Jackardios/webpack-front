const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(patterns) {
    return {
        plugins: [
            new CopyWebpackPlugin(patterns)
        ]
    };
}