const _ = require('underscore');

module.exports = _(require('./webpack.config'))
.chain()
.clone()
.extend({
    output: {
        path: '/',
        filename: '/pn/scripts/bundle.js'
    },
    devtool: 'cheap-module-inline-source-map',
    plugins: []
})
.value();