const webpack = require('webpack')

module.exports = {
    devtool: 'source-map',
    entry: [
        'babel-polyfill',
        './public/scripts/main',
    ],
    module: {
        loaders: [
            { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
            {test: /.less$/, loader: 'style!css!less'},
            {test: /.json$/, loader: 'json'},
            {test: /.js?$/, loader: 'babel', exclude: /node_modules/},
            {test: /.jsx?$/, loader: 'babel', exclude: /node_modules/}
        ],
    },
    output: {
        filename: 'bundle.js',
        path: `${__dirname}/public/scripts/`,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new webpack.IgnorePlugin(/regenerator|nodent|js-beautify/, /ajv/),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            dead_code: true,
            minimize: true,
        }),
    ],
    resolve: {
        extensions: [
            '',
            '.js',
            '.json',
            '.jsx',
        ],
    },
}