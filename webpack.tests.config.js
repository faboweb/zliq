var path = require('path');
var nodeExternals = require('webpack-node-externals');

var index = path.resolve(__dirname, './test/index.js')
module.exports = {
    entry: {
        test: 'mocha-loader!' + index
    },
    output: {
        filename: 'test.build.js',
        path: __dirname + '/test',
        publicPath: 'http://localhost:8081/'
    },
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
    // target: 'node', // in order to ignore built-in modules like path, fs, etc. 
    // externals: [nodeExternals()], // in order to ignore all modules in node_modules folder 
    devServer: {
        host: 'localhost',
        port: '8081'
    }
}