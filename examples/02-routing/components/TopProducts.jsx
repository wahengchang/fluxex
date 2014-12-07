var React = require('react'),
    Fluxex = require('fluxex'),

Product = React.createClass({
    mixins: [
        Fluxex.mixin,
        require('fluxex/extra/storechange'),
        {listenStores: ['productStore']}
    ],

    getStateFromStores: function () {
        return {list: this.getStore('productStore').get('top5')};
    },

    render: function () {
        var list = [],
            I;

        for (I=0;I<this.state.list.length;I++) {
            list.push(<li><a href={'product/' + this.state.list[I].id}>{this.state.list[I].title}</a></li>);
        }

        return (
        <div>
         <h1>Main site</h1>
         <h3>top 5 products....</h3>
         <ul>{list}</ul>
        </div>
        );
    }
});

module.exports = Product;
