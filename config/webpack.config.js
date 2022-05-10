'use strict';

const TerserPlugin = require( 'terser-webpack-plugin' );

const baseConfig = {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin( {
                test: /\.js(\?.*)?$/i,
                // only minimize .min.js files
                include: /\.min\.js$/,
                extractComments: 'some',
                terserOptions: {
                    format: {
                        comments: /@license/i,
                    },
                    compress: {
                        // remove console.logs
                        pure_funcs: [ 'console.log' ],
                    },
                }
            } ),
        ],
    }
};

const moduleConfig = {
    target: 'node',

    // 2 files, raw + min
    entry: {
        '../build/application.module': './src/application.js',
        '../build/application.module.min': './src/application.js',
    },

    // mandatory because of `output.library.type='module'`
    experiments: {
        outputModule: true,
    },

    output: {
        filename: '[name].js', // force .js instead of .mjs
        chunkFormat: 'module',
        library: {
            type: 'module',
        },
    },

    /*
    // Do not export externals
    externals: {
        three: 'three',
    },
    */
    ...baseConfig
};

const browserConfig = {
    target: 'web',

    entry: {
        '../build/application': './src/application.js',
        '../build/application.min': './src/application.js',
    },

    ...baseConfig
};

module.exports = [ moduleConfig, browserConfig ];
