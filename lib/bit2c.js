module.exports = (function() {
   var request = require('request'),
      crypto = require('crypto'),
      moment = require('moment'),
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

   function bit2cPrivateRequest(path, credentials, paramsString, callback) {

      var url = 'https://www.bit2c.co.il/' + path,
         signature;

      signature = crypto.createHmac('sha512', credentials.secret.toUpperCase()).update(paramsString).digest('base64');
      request({
         method: 'POST',
         url: url,
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'key': credentials.key,
            'sign': signature
         },
         body: paramsString
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

      getTrades: function(currency, since, callback) {
         var param;
         if (since) {
            param = {
               key: 'since',
               value: since
            };
         }
         bit2cPublicRequest('trades.json', currency, param, callback);
      },

      getOrderBook: function(currency, callback) {
         bit2cPublicRequest('orderbook.json', currency, undefined, callback);
      },

      getBalance: function(credentials, callback) {
         bit2cPrivateRequest('Account/Balance', credentials,
                             'nonce=' + getUniqueNonce(),
                             callback);
      },

      addOrder: function(credentials, orderDetails, callback) {
         
         var paramsString ='';
         paramsString += 'Amount=' + orderDetails.Amount + '&';
         paramsString += 'Price=' + orderDetails.Price + '&';
         paramsString += 'Total=' + orderDetails.Total + '&';
         paramsString += 'IsBid=' + orderDetails.IsBid + '&';
         paramsString += 'Pair=' + orderDetails.Pair + '&';
         paramsString += 'nonce=' + getUniqueNonce();

         bit2cPrivateRequest('Order/AddOrder', credentials,
                             paramsString,
                             callback);
      },

      getMyOrders: function(credentials, pair, callback) {

         var paramsString = '';
         if (pair) {
            paramsString = 'pair=' + pair + '&';
         }
         paramsString +=  'nonce=' + getUniqueNonce();


         bit2cPrivateRequest('Order/MyOrders', credentials,
                             paramsString,
                             callback);
      },

      cancelOrder: function(credentials, tid, callback) {
         var paramsString = 'id=' + tid + '&';
         paramsString +=  'nonce=' + getUniqueNonce();

         bit2cPrivateRequest('Order/CancelOrder', credentials,
                             paramsString,
                             callback);
      },

      getAccountHistory: function(credentials, from, to, callback) {
         var paramsString = '',
            fromStr,
            toStr;
         
         if (from) {
            fromStr = moment(from).format('DD/MM/YYYY HH:mm:ss.SSS');
         }
         if (to) {
            toStr = moment(to).format('DD/MM/YYYY HH:mm:ss.SSS');
         }

         paramsString += "from=" + (from?fromStr:null) + '&';
         paramsString += "to=" + (to?toStr:null) + '&';
         paramsString +=  'nonce=' + getUniqueNonce();

        bit2cPrivateRequest('Order/AccountHistory', credentials,
                             paramsString,
                             callback);
      },

      createMerchantCheckout: function(credentials, checkoutDetails, callback) {
         
         var paramsString ='';
         paramsString += 'Price=' + checkoutDetails.Price + '&';
         paramsString += 'Description=' + checkoutDetails.Description + '&';
         paramsString += 'CoinType=' + checkoutDetails.CoinType + '&';
         paramsString += 'ReturnUrl=' + checkoutDetails.ReturnUrl + '&';
         paramsString += 'CancelUrl=' + checkoutDetails.CancelUrl + '&';
         paramsString += 'NotifyByEmail=' + checkoutDetails.NotifyByEmail + '&';
         paramsString += 'nonce=' + getUniqueNonce();

         bit2cPrivateRequest('Merchant/CreateCheckout', credentials,
                             paramsString,
                             callback);
      },

      addCoinsRequest: function(credentials, total, currency, callback) {
         var paramsString = '';
         paramsString += 'total=' + total + '&';
         paramsString += 'Coin=' + currency + '&';
         paramsString +=  'nonce=' + getUniqueNonce();

         bit2cPrivateRequest('Order/AddCoinFundsRequest', credentials,
                             paramsString,
                             callback);
      },

      addFundRequest: function(credentials, totalNis, reference, isDeposit, callback) {
         var paramsString = '';
         paramsString += 'TotalInNIS=' + totalNis + '&';
         paramsString += 'Reference=' + reference + '&';
         paramsString += 'IsDeposit=' + ((isDeposit)?'true':'false') + '&';
         paramsString +=  'nonce=' + getUniqueNonce();

         bit2cPrivateRequest('Order/AddFund', credentials,
                             paramsString,
                             callback);
      },

      getPaymentId: function(credentials, callback) {
         var paramsString = '';
         paramsString +=  'nonce=' + getUniqueNonce();

         bit2cPrivateRequest('Payment/GetMyId', credentials,
                             paramsString,
                             callback);
      },

      sendPayment: function(credentials, payTo, amount, currency, callback) {

         var paramsString = '';
         paramsString += 'payTo=' + payTo + '&';
         paramsString += 'Total=' + amount + '&';
         paramsString += 'coin=' + currency + '&';
         paramsString +=  'nonce=' + getUniqueNonce();

         bit2cPrivateRequest('Payment/Send', credentials,
                             paramsString,
                             callback);
      }




   };
   return that;
})();
