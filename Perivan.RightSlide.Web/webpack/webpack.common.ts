var webpack = require('webpack');
var helpers = require('./helpers.ts');
var extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'polyfills': './clientapp/src/polyfills.ts',
        'app': './clientapp/src/main.ts',
        'styles': './wwwroot/content/sass/Fabric.scss'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: { configFileName: 'tsconfig.json' }
                    },
                    'angular2-template-loader',
                    'angular2-router-loader'
                ]
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(png|jpe)$/,
                use: 'file-loader?name=images/[name].[hash].[ext]'
            },
            {
                test: /\.(g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                use: 'file-loader?name=fonts/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                use: extractTextPlugin.extract([{ loader: 'css-loader', options: { minimize: true } }, { loader: 'postcss-loader', options: { config: { path: './webpack/postcss.config.js' } } }])
            },
            {
                test: /\.(sass|scss)$/,
                use: extractTextPlugin.extract([{ loader: 'css-loader', options: { minimize: true, importLoaders: 2 } }, { loader: 'postcss-loader', options: { config: { path: './webpack/postcss.config.js' } } }, { loader: 'sass-loader', options: { minimize: true } }])
            }
        ]
    },
    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            helpers.root('./wwwroot/app'), // location of your src
            {} // a map of your routes
        ),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'polyfills']
        })
    ]
};
