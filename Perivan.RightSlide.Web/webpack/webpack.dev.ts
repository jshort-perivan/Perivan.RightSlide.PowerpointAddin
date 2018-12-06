var webpackMerge = require('webpack-merge');
var extractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.ts');

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        publicPath: 'http://rightslidefrontend:1111/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    plugins: [
        new extractTextPlugin('[name].css')
    ],
    devServer: {
        host: 'rightslidefrontend',
        disableHostCheck: true,
        historyApiFallback: true,
        stats: 'minimal',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
});
