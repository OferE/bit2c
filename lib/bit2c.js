module.exports = (function() {
   var request = require('request'),
      crypto = require('crypto'),
      lastNonce;

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


   function bit2cPrivateRequest(path, credentials, queryString, callback) {

      var url = 'https://www.bit2c.co.il/' + path,
         signature;

      signature = crypto.createHmac('sha512', credentials.secret.toUpperCase()).update(queryString).digest('base64');
      request({
         method: 'POST',
         url: url,
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'key': credentials.key,
            'sign': signature
         },
         body: queryString
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

   // This function will hopefully work - if runnnig the api from the same computer
   // running this from multiple computers will probably fail it since there 
   // might be clock skews
   function getUniqueNonce() {
      // unix time diff ti 14/01/2014 / 250 - the min response time i assume,
      // this technique should be sufficient for the next few years...
      var result = parseInt(((new Date()).getTime() - 1389729146519)/250,10);

      // this is good if from the same process we run multiple parallel requests...
      if (result == lastNonce) {
         result +=1;
      }
      lastNonce = result;
      return result;
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
      },

      getBalance: function(credentials, callback) {
         bit2cPrivateRequest('Account/Balance', credentials,
                             'nonce=' + getUniqueNonce(),
                             callback);
      },

      getMyOrders: function(credentials, pair, callback) {

         var queryString = '';
         if (pair) {
            queryString = 'pair=' + pair + '&';
         }
         queryString +=  'nonce=' + getUniqueNonce();


         bit2cPrivateRequest('Order/MyOrders', credentials,
                             queryString,
                             callback);
      }



   };
   return that;
})();
