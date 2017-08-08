var path              = require('path'),
    BundleTracker     = require('../index'), // load retailify-webpack-stats
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context  : __dirname,
    entry    : {
        'themes/default/js/search_plugin': './themes/assets/js/booking/search-and-book'
    },
    output   : {
        path    : path.resolve('./assets/bundles/'),
        filename: "[name].js"
    },
    plugins  : [
        new BundleTracker({
            filename: './assets/webpack-stats.json',
            absolutePath: '/usr/src/app',
            indent: 2
        }),
        new ExtractTextPlugin('[name]')
    ],
    resolve  : {
        modules   : [
            'node_modules',
            './examples/themes/default/js'
        ],
        extensions: ['.js']
    }
};
