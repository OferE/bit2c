var should = require('should'),
   underscore = require('underscore'),
   bit2c = require('../lib/bit2c.js'),
   credentials = { // TODO - must be removed and passed as env variables
      key: process.env.BIT2C_KEY,
      secret: process.env.BIT2C_SECRET
   };

// describe('checking bit2c public API', function() {
//    
//    it('should get a ticker of BtcNis', function(done) {
//       this.timeout(10000);
//       bit2c.getTicker('BtcNis', function(error, ticker) {
//          should.not.exist(error);
//          should.exist(ticker.ll); // last price
//          should.exist(ticker.av); // last 24 hours price avarage
//          should.exist(ticker.a);  // last 24 hours volume
//          should.exist(ticker.h);  // highest buy order
//          should.exist(ticker.l);  // lowest sell order
//          done();
//       });
//    });
// 
//    it('should get a ticker of LtcBtc', function(done) {
//       this.timeout(10000);
//       bit2c.getTicker('LtcBtc', function(error, ticker) {
//          should.not.exist(error);
//          should.exist(ticker.ll); // last price
//          should.exist(ticker.av); // last 24 hours price avarage
//          should.exist(ticker.a);  // last 24 hours volume
//          should.exist(ticker.h);  // highest buy order
//          should.exist(ticker.l);  // lowest sell order
//          done();
//       });
//    });
// 
//    it('should get trades of BtcNis', function(done) {
//       this.timeout(10000);
//       bit2c.getTrades('BtcNis', function(error, ticker) {
//          should.not.exist(error);
//          ticker.length.should.be.above(0);
//          should.exist(ticker[0].date);
//          should.exist(ticker[0].price);
//          should.exist(ticker[0].amount);
//          should.exist(ticker[0].tid);
//          done();
//       });
//    });
// 
//    it('should get trades of LtcBtc', function(done) {
//       this.timeout(10000);
//       bit2c.getTrades('LtcBtc', function(error, ticker) {
//          should.not.exist(error);
//          ticker.length.should.be.above(0);
//          should.exist(ticker[0].date);
//          should.exist(ticker[0].price);
//          should.exist(ticker[0].amount);
//          should.exist(ticker[0].tid);
//          done();
//       });
//    });
// 
//    it('should get order book of BtcNis', function(done) {
//       this.timeout(10000);
//       bit2c.getOrderBook('BtcNis', undefined, function(error, orderBook) {
//          should.not.exist(error);
//          should.exist(orderBook.bids);
//          should.exist(orderBook.asks);
//          orderBook.bids.length.should.be.above(0);
//          orderBook.asks.length.should.be.above(0);
//          done();
//       });
//    });
// 
//    it('should get order book of LtcBtc', function(done) {
//       this.timeout(10000);
//       bit2c.getOrderBook('LtcBtc', undefined, function(error, orderBook) {
//          should.not.exist(error);
//          should.exist(orderBook.bids);
//          should.exist(orderBook.asks);
//          orderBook.bids.length.should.be.above(0);
//          orderBook.asks.length.should.be.above(0);
//          done();
//       });
//    });
// });
// 
describe('checking bit2c private API', function() {

   it('should check balance', function(done) {
      this.timeout(10000);
      bit2c.getBalance(credentials, function(error, balance) {
         should.not.exist(error);
         should.exist(balance.BalanceBTC);
         should.exist(balance.BalanceLTC);
         should.exist(balance.BalanceNIS);
         done();
      });
   });

   it('should check my BtcNis orders', function(done) {
      this.timeout(10000);
      bit2c.getMyOrders(credentials, 'BtcNis', function(error, orders) {
         should.not.exist(error);
         should.exist(orders.bids);
         should.exist(orders.asks);
         done();
      });
   });

   it('should check my LtcBtc orders', function(done) {

      // timeout is needed due to bit2c bug/feature
      this.timeout(10000);
      setTimeout(function(){
         bit2c.getMyOrders(credentials, 'LtcBtc', function(error, orders) {
            should.not.exist(error);
            should.exist(orders.bids);
            should.exist(orders.asks);
            done();
         });
      }, 1000);
   });
   
   it('should check my LtcNis orders', function(done) {

      // timeout is needed due to bit2c bug/feature
      this.timeout(10000);
      setTimeout(function(){
         bit2c.getMyOrders(credentials, 'LtcNis', function(error, orders) {
            should.not.exist(error);
            should.exist(orders.bids);
            should.exist(orders.asks);
            done();
         });
      }, 1000);
   });

   it('should cancel an order', function(done) {
      this.timeout(10000);
      bit2c.cancelOrder(credentials, 17, function(error, result) {
         should.not.exist(error);
         should.exist(result.OrderResponse);
         done();
      });
   });

   it ('should get last year\'s account history', function(done) {
      var to = new Date(),
         from = (new Date()).getTime() - (1000*60*60*24*365);

      this.timeout(10000);
      bit2c.getAccountHistory(credentials, from, to, function(error, result) {
         should.not.exist(error);

         should.exist(result);
         result.should.be.an.instanceOf(Array);
         console.log(result);
         done();
      });
   });






});

