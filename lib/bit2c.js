module.exports = (function() {
   var request = require('request');

   function bit2cPublicRequest(operation, currency, param, callback) {
      
      var url = 'https://www.bit2c.co.il/Exchanges/' + currency + '/' + operation;
      if (param) {
         url += '?'+ param.key + '=' + param.value;
      }

      request({
            method: 'GET',
            url: url
         }, function(error, response, bodyString) {

            var normalResponseCode = '200';
     
            if (error !== null || (typeof (bodyString) !== 'string') ||
                (response.statusCode + '' !== normalResponseCode)) {
               callback(new Error('cannot get response from bit2c. error: ' + error + 
                                  ' reason: ' +
                                  (response?response.statusCode:'undefined')));
               return;
            }

            callback(undefined, JSON.parse(bodyString));
         });

   }


   var that = {

      getTicker: function(currency, callback) {
         bit2cPublicRequest('Ticker.json', currency,  undefined, callback);
      },

      getTrades: function(currency, callback) {
         bit2cPublicRequest('trades.json', currency, undefined, callback);
      },

      getOrderBook: function(currency, since, callback) {

         var param;
         if (since) {
            param = {
               key: 'since',
               value: since
            };
         }

         bit2cPublicRequest('orderbook.json', currency, param, callback);
      }

   };
   return that;
})();
