var path = require('path');
var port = 8081;
var nodeExternals = require('webpack-node-externals');

module.exports = {
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "null-loader" // do not load styles while testing
            }]
        },{
            test: /\.(js|jsx)$/,
            use: [{
                loader: 'babel-loader'
            }]
        }]
    },
    target: 'node', // in order to ignore built-in modules like path, fs, etc. 
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder 
    devServer: {
        port: port
    }
}