module.exports = {
    // karma watches the test entry points
    // (you don't need to specify the entry option)
    // webpack watches dependencies

    // webpack configuration
    devtool: 'inline-source-map',
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
    }
}