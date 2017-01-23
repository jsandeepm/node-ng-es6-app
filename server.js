"use strict";

// tested with node 4.4.3
// this file is not transpiled using babel
const express = require('express');
const compression = require('compression');
require('jade');

const appBaseUrl = '/pn';

const app = express();
app.set('view engine', 'pug');
app.use(compression());

if ( process.env.NODE_ENV !== 'production' ) {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpack = require('webpack');
    const middlewareOptions = {
        stats: { colors: true },
        noInfo: true  // Comment this out for more verbose webpack information
    };
    app.use(webpackDevMiddleware(webpack(require('./webpack.dev.config')), middlewareOptions));

    const lessMiddleware = require('less-middleware');
    app.use(`${appBaseUrl}/styles`, lessMiddleware('./public/styles'));
}

app.use(`${appBaseUrl}/styles`, express.static('./public/styles'));
app.use(`${appBaseUrl}/scripts`, express.static('./public/scripts'));

app.get('/*', (req, res) => {
    // template is not actually needed because we're not doing server-side rendering... you could pre-render
    // the template and send a string or just use static html
    res.render('index', {appBaseUrl, title: 'Product Nomenclature'});
});

const port = parseInt(process.env.PORT || 3000, 10);

const server = app.listen(port, () => {
    const address = server.address();
    const url = `http://${address.host || 'localhost'}:${port}`;
    console.info(`Listening at ${url}`);
});