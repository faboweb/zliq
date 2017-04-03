
var path = require('path');

module.exports = {
    entry: './src/benchmark.jsx',
    devtool: 'source-map',
    output: {
		path: __dirname + "/benchmark",
        filename: 'benchmark.js'
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        },{
            test: /\.(js|jsx)$/,
            use: [{
                loader: 'babel-loader'
            }]
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, "benchmark"),
        compress: true,
        port: 8080
    }
}