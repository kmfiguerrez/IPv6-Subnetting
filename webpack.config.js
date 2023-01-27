const path = require('path');

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, 'src/ts/main.ts'),
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },   
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                include: [path.resolve(__dirname, 'src/ts/')]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { 
                test: /\.js$/, 
                loader: "source-map-loader" 
            }
        ]
    },      
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    }
}