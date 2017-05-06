var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'zliq.js',
        library: 'zliq',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: [{
                loader: 'babel-loader',
                query: {
                    presets: ['babili']
                }
            }]
        }]
    }
}