var bit2c = require('./lib/bit2c.js');

bit2c.getTicker('BtcNis', function(error, ticker) {
   console.log('ticker: ' + JSON.stringify(ticker, null, '   '));
});

bit2c.getTrades('BtcNis', function(error, ticker) {
   console.log('trades: ' + JSON.stringify(ticker, null, '   '));
});

bit2c.getOrderBook('BtcNis', undefined, function(error, ticker) {
   console.log('order book: ' + JSON.stringify(ticker, null, '   '));
});

bit2c.getTicker('LtcBtc', function(error, ticker) {
   console.log('ticker: ' + JSON.stringify(ticker, null, '   '));
});

bit2c.getTrades('LtcBtc', function(error, ticker) {
   console.log('trades: ' + JSON.stringify(ticker, null, '   '));
});

bit2c.getOrderBook('LtcBtc', undefined, function(error, ticker) {
   console.log('order book: ' + JSON.stringify(ticker, null, '   '));
});




