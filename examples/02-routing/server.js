'use strict';

var express = require('express'),
    fluxexapp = require('./fluxexapp'),
    routing = require('./actions/routing'),
    fluxexServerExtra = require('fluxex/extra/server'),
    app = express();

// Provide /static/js/main.js
fluxexServerExtra.initStatic(app);

// Mount test pages with routing action
app.use(fluxexServerExtra.middleware(fluxexapp, function (req) {
    return this.dispatch('UPDATE_URL', req.url).then(function () {
        return this.executeAction(routing);
    });
}));

// Start server
app.listen(3000);
console.log('Fluxex started! Go http://localhost:3001/main');
