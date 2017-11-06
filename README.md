This application analyzes cryptocurrency trade data in real-time in order to provide real-time data on cryptocurrency volatility.

It does this using Node, Express, WebSockets, MongoDB, and Heroku.

The server connects to the Bitfinex WebSocket API. When Bitfinex broadcasts a message indicating a new BTCUSD trade, the server compares it to an earlier trade in order to calculate a rate of return between those trades. A custom statistics library analyzes the trailing 24 hours of rate of return calculations to find the standard deviation, which indicates how much the rate of return has varied over that time period. This represents the volatility. That volatility calculation is then broadcasted over a WebSocket connection to any connected clients.

You can establish a WebSocket connection to the server with a WebSocket adapter of your choice. A great example is the command-line tool 'wscat'. First, install wscat:

`npm install -g wscat`

Then, connect to the server:

`wscat -c wss://btcusd-volatility-server.herokuapp.com/`
