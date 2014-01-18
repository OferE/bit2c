#  API Reference
## Public API
- [`getTicker(pair, callback)`](#gettickerpair-callback)
- [`getTrades(pair, since, callback)`](#gettradespair-since-callback)
- [`getOrderBook(pair, callback)`](#getorderbookpair-callback)

## Private API
- [`getBalance(credentials, callback)`](#getbalancecredentials-callback)
- [`getMyOrders(credentials, pair, callback)`](#getmyorderscredentials-callback)
- [`addOrder(credentials, orderDetails, callback)`](#addordercredentials-orderdetails-callback)
- [`cancelOrder(credentials, tid, callback)`](#cancelordercredentials-tid-callback)
- [`getAccountHistory(credentials, from, to, callback)`](#getaccounthistorycredentials-from-to-callback)
- [`createMerchantCheckout(credentials, checkoutDetails, callback)`](#createmerchantcheckoutcredentials-checkoutdetails-callback)

### `getTicker(pair, callback)`

Returns a ticker of a given pair.

- `pair` - A string of the currency type. Either 'BtcNis' or 'LtcBtc'

### `getTrades(pair, since, callback)`

Returns closed trades of a given pair.

- `pair` - A string of the currency type. Either 'BtcNis' or 'LtcBtc'
- `since` - Return transactions for the last 'tid'

### `getOrderBook(pair, callback)`

Returns the orderbook of a given pair.

- `pair` - A string of the currency type. Either 'BtcNis' or 'LtcBtc'

### `getBalance(credentials, callback)`

Returns the balance of the given account

- `credentials` - An object of type {key: your-key, secret: your-secret}

### `getMyOrders(credentials, callback)`

Returns the live orders of the given account

- `credentials` - An object of type {key: your-key, secret: your-secret}
- `pair` - A string of the currency type. Either 'BtcNis' or 'LtcBtc'

### `addOrder(credentials, orderDetails, callback)`

Adds an order to the order book.

- `credentials` - An object of type {key: your-key, secret: your-secret}
- `orderDetails` - An object of the type: {Amount: amount, Price: price, Total: total: IsBid: true/false, Pair: pair}

### `cancelOrder(credentials, tid, callback)`

Cancel an order

- `credentials` - An object of type {key: your-key, secret: your-secret}
- tid - The transaction id

### `getAccountHistory(credentials, from, to, callback)`

Returns the account history in the interval of [from, to]
Important - This function is about to be changed soon

- `credentials` - An object of type {key: your-key, secret: your-secret}
- `from` - A date of from, in basically any format
- `to` - A date of to, in basically any format

### `createMerchantCheckout(credentials, checkoutDetails, callback)`

Merchant create checkout button id

- `credentials` - An object of type {key: your-key, secret: your-secret}
- `checkoutDetails` - An object of type: {Price: price, Description: description, CoinType: 'btc', ReturnUrl: url, CancelUrl: url, NotifyByEmail: true/false}}
