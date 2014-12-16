Start from Scratch
==================

Build your own fluxex application from scratch!

Prepare the project
-------------------
```
npm init
npm install fluxex react node-jsx express browserify watchify reactify uglifyify jshint-stylish nodemon browser-sync gulp gulp-jshint gulp-react gulp-cached gulp-util vinyl-source-stream
mkdir actions
mkdir components
mkdir stores
```

Create Action
-------------
[actions/page.js] Define an action.

```javascript
module.exports = function () {
    return this.dispatch('UPDATE_PRODUCT', {
        title: 'sample product',
        price: 12345,
        sold: 0
    });
};
```

Create Store
------------
[stores/product.js] Define your store API and handle the action.

```javascript
module.exports = {
    handle_UPDATE_PRODUCT: function (payload) {
        this.set('data', payload, true);
        this.emitChange();
    },
    getData: function () {
        return this.get('data');
    }
};
```

Create HTML
-----------
[components/Html.jsx] Define your page as react component.

```jsx
'use strict';

var React = require('react'),
    Fluxex = require('fluxex'),

Html = React.createClass({
    mixins: [
        Fluxex.mixin,
        require('fluxex/extra/storechange'),
        {listenStores: ['product']}
    ],

    getStateFromStores: function () {
        return this.getStore('product').getData();
    },

    handleClick: function () {
        var product = this.state;
        product.sold++;
        this.executeAction(function () {
            return this.dispatch('UPDATE_PRODUCT', product);
        });
    },

    render: function () {
        return (
        <html>
         <head>
          <meta charSet="utf-8" />
         </head>
         <body onClick={this.handleClick}>
          <ul>
           <li>Product: {this.state.title}</li>
           <li>Price: {this.state.price}</li>
           <li>Sold: {this.state.sold}</li>
          </ul>
         <script src="/static/js/main.js"></script>
         <script dangerouslySetInnerHTML={{__html: this.getInitScript()}}></script>
         </body>
        </html>
        );
    }
});

module.exports = Html;
```

Create Your App
---------------
[fluxexapp.js] Provide store `{name: implementation}` pairs and Html.jsx.

```javascript
'use strict';

module.exports = require('fluxex').createApp({
    product: require('./stores/product')
}, process.cwd() + '/components/Html.jsx');
```

The Server
----------
[index.js] Create an express server.
```javascript
'use strict';

var express = require('express'),
    fluxexapp = require('./fluxexapp'),
    pageAction = require('./actions/page'),
    fluxexServerExtra = require('fluxex/extra/server'),
    app = express();

// Provide /static/js/main.js
fluxexServerExtra.initStatic(app);

// Mount test page at /test
app.use('/test', fluxexServerExtra.middleware(fluxexapp, pageAction));

// Start server
app.listen(3000);
console.log('Fluxex started on port 3000');
```

Create gulp task
----------------
[gulpfile.js] Use the fluxex gulpfile extra.
```javascript
require('fluxex/extra/gulpfile');
```

**Start the server**

`gulp develop` then browse http://localhost:3001/test , click on the page to see React rendering!