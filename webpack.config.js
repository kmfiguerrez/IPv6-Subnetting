const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, 'src/ts/main.ts'),
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css"
        }),
        new HtmlWebpackPlugin({
            title: "IPv6 Subnetting",
            filename: "index.html",
            template: "./src/template.html"
        })
    ],

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
            },
            {
                test: /\.scss$/,
                use: [                  
                  MiniCssExtractPlugin.loader,
                  // Translates CSS into CommonJS
                  "css-loader",
                  "postcss-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
            }
        ]
    },      
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    }
}