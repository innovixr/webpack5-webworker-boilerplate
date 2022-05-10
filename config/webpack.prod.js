const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const networkInterfaces = require( 'os' ).networkInterfaces;

const MODULE_NAME = 'application';
const PUBLIC_PATH = 'public';
const TEMPLATE_PATH = `../${PUBLIC_PATH}/templates`;
const RE_NETWORK_INTERFACE = /wi-fi|eth0|Ethernet/i;

function getIpAddress( interfaceRegexp ) {
    console.assert( interfaceRegexp instanceof RegExp );

    const nets = networkInterfaces();
    const keys = Object.keys( nets );
    let ip, name, net;

    for ( name of keys )
    {
        for ( net of nets[ name ] )
        {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (
                net.family === 'IPv4'
                && !net.internal
                && name.match( interfaceRegexp )
            )
            {
                ip = net.address;
            }

        }

    }

    if ( !ip )
    {
        throw new Error( 'Error: could not fetch private IP address' );
    }

    return ip;
}

const plugins = [
    new HtmlWebpackPlugin( {
        environment: {
            production: false
        },
        filename: 'index.html',
        template: path.resolve( __dirname, `${TEMPLATE_PATH}/index.html` ),
        inject: true
    } )
];

module.exports = env => {

    let mode = 'development';
    let devtool = 'eval-source-map';

    // Prod environment
    if ( env.NODE_ENV === 'prod' )
    {
        devtool = false;
        mode = 'production';
    }

    const entry = {};
    entry[ `/dist/${MODULE_NAME}` ] = `./src/${MODULE_NAME}.js`;

    // add an alias of for itself (import "application"), avoid import "../src/application.js"
    const alias = {};
    alias[ `${MODULE_NAME}` ] = path.resolve( __dirname, `../src/${MODULE_NAME}.js` );
    //alias[ `${MODULE_NAME}/${PUBLIC_PATH}` ] = path.resolve( __dirname, `../${PUBLIC_PATH}/` );

    const wp = {
        mode,
        devtool,
        entry,
        plugins,
        devServer: {
            server: env.NODE_SSL ? 'https' : 'http',
            port: env.NODE_SSL ? '8443' : '8080',
            host: env.NODE_SSL ? getIpAddress( RE_NETWORK_INTERFACE ) : 'localhost',

            static: {
                directory: path.join( __dirname, `../${PUBLIC_PATH}/assets/` ),
                publicPath: '/assets',
            },

            // avoid error "HookWebpackError: HMR is not implemented for module chunk format yet"
            hot: false,

        },

        output: {
            filename: '[name].js',
            path: path.resolve( __dirname, '../dist' )
        },

        resolve: {
            alias
        },

        module: {
            rules: [
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [ 'file-loader' ],
                }
            ],
        }
    };

    const wp2 = {
        mode,
        devtool,
        target: 'web',
        experiments: {
            outputModule: true,
        },
        entry: {
            'application-module': './src/application.js'
        },
        output: {
            filename: '[name].js', // force .js instead of .mjs
            chunkFormat: 'module',
            library: {
                type: 'module',
            }
        },
    };

    return [ wp, wp2 ];
};
