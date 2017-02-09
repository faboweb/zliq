var path = require('path');

module.exports = {
    entry: './src/demo_app.jsx',
    output: {
        path: path.resolve(__dirname, 'demo'),
        filename: 'bundle.js'
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
        contentBase: path.join(__dirname, "demo"),
        compress: true,
        port: 8080
    }
}