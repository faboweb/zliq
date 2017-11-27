var path = require('path');

module.exports = { 
    devtool: 'source-map', 
    entry: './demo/demo_app.jsx',
    output: {
        path: path.resolve(__dirname, '../demo'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.(css|scss)$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        },{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules)/,
            use: [{
                loader: 'babel-loader',
                query: {
                    retainLines: true,
                    cacheDirectory: true
                }
            }]
        },{
            test: /\.(tff|woff|woff2)$/,
            use: [{
                loader: 'null-loader'
            }]
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, "../demo"),
        historyApiFallback: true
    }
}