'use strict';

var React = require('react'),
    Fluxex = require('fluxex'),
    Product = require('./Product.jsx'),
    TopProducts = require('./TopProducts.jsx'),
    routeAction = require('../actions/routing'),

Html = React.createClass({
    mixins: [
        Fluxex.mixin,
        require('fluxex/extra/storechange'),
        {listenStores: ['page']}
    ],

    getStateFromStores: function () {
        return {
            route_name: this.getStore('page').get('routing.name'),
            no_historyapi: true
        };
    },

    componentDidMount: function () {
        /*global window,document*/
        var blockDoublePop = (document.readyState != 'complete'),
            initState = this._getContext().toString(),
            initUrl = window.location.href,
            self = this;

        // Do not use history api...
        if (this.state.no_historyapi || !window.addEventListener) {
            return;
        }

        window.addEventListener('load', function() {
            setTimeout(function () {
                blockDoublePop = false;
            }, 1);
        });

        window.addEventListener('popstate', function (E) {
            var state = E.state || ((window.location.href === initUrl) ? initState : undefined);

            if (blockDoublePop && (document.readyState === 'complete')) {
                return;
            }

            if (!state) {
                return console.log('NO STATE DATA....can not handle re-rendering');
            }

            // Ya, trigger page restore by an anonymous action
            self.executeAction(function () {
                    this.restore(JSON.parse(state));
                    this.dispatch('UPDATE_TITLE');
                    this.getStore('productStore').emitChange();
                    return this.resolvePromise(true);
                });
            });
    },

    handleClickLink: function (E) {
        var HREF = E.target.href,
            self = this;

        if (this.state.no_historyapi || !HREF || HREF.match(/#/)) {
            return;
        }

        E.preventDefault();
        E.stopPropagation();

        // Go to the url
        this._getContext().dispatch('UPDATE_URL', HREF).then(function () {
            // Run action to update page stores
            return this.executeAction(routeAction, this.getStore('page').get('location.path'));
        }).then(function () {
            // Success, update url to history
            /*global history*/
            history.pushState(self._getContext().toString(), undefined, HREF);
        });
    },

    render: function () {
        var body;

        switch (this.state.route_name) {
        case 'top':
            body = <TopProducts />;
            break;
        case 'product':
            body = <Product />;
            break;
        }

        return (
        <html>
         <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <title>{this.getStore('page').get('title')}</title>
         </head>
         <body onClick={this.handleClickLink}>
          {body}
          <hr />
          <a href="/main">Go to Main...</a>
         </body>
         <script src="/static/js/main.js"></script>
         <script dangerouslySetInnerHTML={{__html: this._getInitScript()}}></script>
<script>
</script>
        </html> 
        );
    }
});

module.exports = Html;
