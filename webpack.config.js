const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')

let config = {
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/dist",
        filename: "main.js"
    },
    resolve: {
        extensions: ['.js', '.ts', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            }
            ],
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

module.exports = config;