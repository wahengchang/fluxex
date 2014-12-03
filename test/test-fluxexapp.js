'use strict';

var assert = require('chai').assert,
    fluxex = require('../'),
    app = require('./testApp');

describe('a fluxex app', function () {
    it('can be constructed by undefined', function (done) {
        var A = new app();
        done();
    });

    it('can be constructed by number', function (done) {
        var F = new app(123);
        done();
    });

    it('can be constructed by object', function (done) {
        var F = new app({stores: {sampleStore: {a: 1}}});

        assert.equal(1, F.getStore('sampleStore').get('a'));
        done();
    });

    it('will throw when no store defined', function (done) {
        assert.throws(function () {
            var App = fluxex.createApp();
            new App();
        }, Error, 'You should create app with information of stores');
        done();
    });
});