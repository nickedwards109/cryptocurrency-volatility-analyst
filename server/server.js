'use strict';

const streamingEndpoint = require('./config/streaming_endpoint');
const mongoDbUri = process.env.MONGODB_URI;
const Trade = require('./models/Trade');
const Statistics = require('./lib/Statistics');

const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
const path = require('path');
const mongodb = require('mongodb');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const TRADES_COLLECTION = require('./config/db_collections');

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(mongoDbUri, (err, database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Initialize the app.
  const server = express()
    .use((request, response) => {
      response.set('Access-Control-Allow-Origin', '*');
      response.sendFile(INDEX);
    })
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));

  // Create a WebSocket client which will get incoming data from a streaming endpoint
  const webSocketClient = new WebSocket(streamingEndpoint, {
    perMessageDeflate: false
  });

  // Indicate what channel of the BitFinex WebSocket API to subscribe to
  let subscriptionMessage = JSON.stringify({
    event: 'subscribe',
    channel: 'trades',
    symbol: 'tBTCUSD'
  });

  // When the WebSocket connection is opened, subscribe to the specified channel
  webSocketClient.on('open', () => {
    console.log('Connection to the BitFinex WebSocket API is opened!');
    webSocketClient.send(subscriptionMessage);
  });

  // Create a WebSocket server which will serve up calculated data
  const webSocketServer = new SocketServer({ server });

  // When the BitFinex WebSocket server sends a trade message to our WebSocket client:
  //  - Parse the message to create a Trade instance
  //  - Insert the new trade in the database
  //  - Get the time of the trade, as well as the time of 5 minutes ago
  //  - Get the prices of every trade within the last 5 minutes
  //  - Calculate the standard deviation of that set of price data. This is the volatility.
  //  - Send the volatility as a message from our WebSocket server
  webSocketClient.on('message', rawMessage => {
    const newTrade = Trade.parseMessage(rawMessage);
    if (!!newTrade.price && !!newTrade.timeStamp) {
    Trade.insert(newTrade, database)
    .then((trade) => {
      const now = trade.timeStamp;
      const fiveMinutesAgo = now - 300;
      database.collection(TRADES_COLLECTION)
      .find({ timeStamp: { $gt: fiveMinutesAgo } }).toArray()
      .then((trailingTrades) => {
        const trailingPrices = Trade.getPrices(trailingTrades);
        const volatility = Statistics.standardDeviation(trailingPrices);
        const outputMessage = JSON.stringify({
          marketPrice: "$" + newTrade.price,
          volatility: "$" + volatility
        });
        webSocketServer.clients.forEach((client) => {
          client.send(outputMessage);
        });
      })
      .then(() => {
        database.collection(TRADES_COLLECTION)
        .remove({ timeStamp: { $lt: fiveMinutesAgo } });
      });
    });
    }
  });
});
