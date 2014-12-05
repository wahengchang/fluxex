'use strict';

var React = require('react'),
    Fluxex = require('fluxex'),
    Product = require('./Product.jsx'),
    Sample = require('./Sample.jsx'),

Html = React.createClass({
    mixins: [Fluxex.mixin],

    shouldComponentUpdate: function () {
        return false;
    },

    render: function () {
        return (
        <html>
         <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <title>{this.getStore('page').get('title')}</title>
         </head>
         <body>
          <Product />
          <Sample />
         </body>
         <script src="/static/js/main.js"></script>
         <script dangerouslySetInnerHTML={{__html: this._getInitScript()}}></script>
        </html> 
        );
    }
});

module.exports = Html;