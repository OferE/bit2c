var should = require('should'),
   underscore = require('underscore'),
   bit2c = require('../lib/bit2c.js'),
   credentials = { // TODO - must be removed and passed as env variables
      key: process.env.BIT2C_KEY,
      secret: process.env.BIT2C_SECRET
   },
   g_transactionId = 17;

describe('checking bit2c public API', function() {   
   
   it('should get a ticker of BtcNis', function(done) {
      this.timeout(20000);
      bit2c.getTicker('BtcNis', function(error, ticker) {
         should.not.exist(error);
         should.exist(ticker.ll); // last price
         should.exist(ticker.av); // last 24 hours price avarage
         should.exist(ticker.a);  // last 24 hours volume
         should.exist(ticker.h);  // highest buy order
         should.exist(ticker.l);  // lowest sell order
         done();
      });
   });

   it('should get a ticker of LtcBtc', function(done) {
      this.timeout(20000);
      bit2c.getTicker('LtcBtc', function(error, ticker) {
         should.not.exist(error);
         should.exist(ticker.ll); // last price
         should.exist(ticker.av); // last 24 hours price avarage
         should.exist(ticker.a);  // last 24 hours volume
         should.exist(ticker.h);  // highest buy order
         should.exist(ticker.l);  // lowest sell order
         done();
      });
   });

   it('should get trades of BtcNis', function(done) {
      this.timeout(20000);
      bit2c.getTrades('BtcNis', undefined, function(error, ticker) {
         should.not.exist(error);
         ticker.length.should.be.above(0);
         should.exist(ticker[0].date);
         should.exist(ticker[0].price);
         should.exist(ticker[0].amount);
         should.exist(ticker[0].tid);
         done();
      });
   });

   it('should get trades of LtcBtc', function(done) {
      this.timeout(20000);
      bit2c.getTrades('LtcBtc', undefined, function(error, ticker) {
         should.not.exist(error);
         ticker.length.should.be.above(0);
         should.exist(ticker[0].date);
         should.exist(ticker[0].price);
         should.exist(ticker[0].amount);
         should.exist(ticker[0].tid);
         done();
      });
   });

   it('should get order book of BtcNis', function(done) {
      this.timeout(20000);
      bit2c.getOrderBook('BtcNis', function(error, orderBook) {
         should.not.exist(error);
         should.exist(orderBook.bids);
         should.exist(orderBook.asks);
         orderBook.bids.length.should.be.above(0);
         orderBook.asks.length.should.be.above(0);
         done();
      });
   });

   it('should get order book of LtcBtc', function(done) {
      this.timeout(20000);
      bit2c.getOrderBook('LtcBtc', function(error, orderBook) {
         should.not.exist(error);
         should.exist(orderBook.bids);
         should.exist(orderBook.asks);
         orderBook.bids.length.should.be.above(0);
         orderBook.asks.length.should.be.above(0);
         done();
      });
   });
});


if (!credentials.key && !credentials.secret) {
   console.log('cant test the private API functionality, ' + 
               'please define 2 env variables: BIT2C_KEY and BIT2C_SECRET');
   process.exit(0);
}

describe('checking bit2c private API', function() {

   it('should check balance', function(done) {
      this.timeout(20000);
      bit2c.getBalance(credentials, function(error, balance) {
         should.not.exist(error);
         should.exist(balance.BalanceBTC);
         should.exist(balance.BalanceLTC);
         should.exist(balance.BalanceNIS);
         done();
      });
   });

   it('should check my BtcNis orders', function(done) {
      this.timeout(20000);
      bit2c.getMyOrders(credentials, 'BtcNis', function(error, orders) {
         should.not.exist(error);
         should.exist(orders.bids);
         should.exist(orders.asks);
         done();
      });
   });

   it('should check my LtcBtc orders', function(done) {

      // timeout is needed due to bit2c bug/feature
      this.timeout(20000);
      setTimeout(function(){
         bit2c.getMyOrders(credentials, 'LtcBtc', function(error, orders) {
            should.not.exist(error);
            should.exist(orders.bids);
            should.exist(orders.asks);
            done();
         });
      }, 1500);
   });
   
   it ('should add an order', function(done) {
      this.timeout(20000);
      setTimeout(function(){
         var orderDetails = {
            Amount: 15,
            Price: 1,
            Total: 15,
            IsBid: true,
            Pair: 'BtcNis'
         };

         bit2c.addOrder(credentials, orderDetails, function(error, result) {
            should.not.exist(error);
            should.exist(result);
            should.exist(result.OrderResponse);

            if (result.NewOrder && result.NewOrder.id) {
               g_transactionId = result.NewOrder.id;
            }
            done();
         });
      },1500);
   });

   it('should check my LtcNis orders', function(done) {

      // timeout is needed due to bit2c bug/feature
      this.timeout(20000);
      setTimeout(function(){
         bit2c.getMyOrders(credentials, 'LtcNis', function(error, orders) {
            should.not.exist(error);
            should.exist(orders.bids);
            should.exist(orders.asks);
            done();
         });
      }, 1500);
   });

   it('should cancel an order', function(done) {
      this.timeout(20000);
      setTimeout(function(){
         bit2c.cancelOrder(credentials, g_transactionId, function(error, result) {
            should.not.exist(error);
            should.exist(result.OrderResponse);
            done();
         });
      }, 1500);
   });

   it ('should get last year\'s account history', function(done) {
      var to = new Date(),
         from = (new Date()).getTime() - (1000*60*60*24*365);

      this.timeout(20000);
      bit2c.getAccountHistory(credentials, from, to, function(error, result) {
         should.not.exist(error);
         should.exist(result);
         result.should.be.an.instanceOf(Array);
         done();
      });
   });
   
   it ('should create merchant checkout', function(done) {
      this.timeout(30000);
      setTimeout(function() {

         var checkoutDetails = {
            Price: 10,
            Description: 'this item is for sell in btc!',
            CoinType: 'Btc',
            ReturnUrl: 'http://link.to.my.cool.store',
            CancelUrl: 'http://link.to.cancel.the.buy',
            NotifyByEmail: true
         };

         bit2c.createMerchantCheckout(credentials, checkoutDetails, function(error, result) {
            should.not.exist(error);
            should.exist(result.id);
            done();
         });
      },1000);
   });

   it ('should find coins fund address for Bitcoin (AddCoinFundsRequest)', function(done) {

      this.timeout(30000);
      bit2c.addCoinsRequest(credentials, 50, 'Btc', function(error, result) {
         should.not.exist(error);
         should.exist(result);
         should.exist(result.address);
         done();
      });
   });
 
   it ('should find coins fund address for Litecoin (AddCoinFundsRequest)', function(done) {

      this.timeout(30000);
      bit2c.addCoinsRequest(credentials, 50, 'Ltc', function(error, result) {
         should.not.exist(error);
         should.exist(result);
         should.exist(result.address);
         done();
      });
   });
 
   // it ('should add funds request NIS (AddFund)', function(done) {

   //    this.timeout(30000);
   //    bit2c.addFundRequest(credentials, 50, '12345678', true, function(error, result) {
   //       should.not.exist(error);
   //       should.exist(result);
   //       console.log(result);
   //       done();
   //    });
   // });
 
   it ('should get my payment id (GetMyId)', function(done) {

      this.timeout(30000);
      bit2c.getPaymentId(credentials, function(error, result) {
         should.not.exist(error);
         should.exist(result);
         done();
      });
   });
 
   // it ('should send bitcoin payment (GetMyId)', function(done) {

   //    this.timeout(30000);

   //    bit2c.sendPayment(credentials, 'kukuGuid', 0.0001, 'Btc', function(error, result) {
   //       should.not.exist(error);
   //       should.exist(result);
   //       console.log(result);
   //       done();
   //    });
   // });
});

