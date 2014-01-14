var bit2c = require('./lib/bit2c.js'),
   credentials = { // TODO - must be removed and passed as env variables
      key: process.env.BIT2C_KEY,
      secret: process.env.BIT2C_SECRET
   };

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

bit2c.getBalance(credentials, function(error, balance) {
   console.log('my balance: ' + JSON.stringify(balance, null, '   '));
});

bit2c.getMyOrders(credentials, 'LtcBtc', function(error, balance) {
   console.log('my orders: ' + JSON.stringify(balance, null, '   '));
});


