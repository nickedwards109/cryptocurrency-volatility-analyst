'use strict';

const streamingEndpoint = require('./config/streaming_endpoint');
const mongoDbUri = process.env.MONGODB_URI;
const Trade = require('./models/Trade');
const RateOfReturn = require('./models/RateOfReturn');
const Statistics = require('./lib/Statistics');

const express = require('express');
const WebSocket = require('ws');
const SocketServer = require('ws').Server;
const path = require('path');
const mongodb = require('mongodb');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const TRADES_COLLECTION = require('./config/db_collections').trades;

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

  // Indicate what channel of the streaming endpoint to subscribe to
  let subscriptionMessage = JSON.stringify({
    event: 'subscribe',
    channel: 'trades',
    symbol: 'tBTCUSD'
  });

  // When the WebSocket connection is opened, subscribe to the specified channel
  webSocketClient.on('open', () => {
    console.log('Connection opened!');
    webSocketClient.send(subscriptionMessage);
  });

  // Create a WebSocket server which will serve up calculated data
  const webSocketServer = new SocketServer({ server });

  // When the streaming endpoint sends a message to our WebSocket client:
  //  - Parse the message to create a Trade instance
  //  - Insert the new trade in the database
  //  - Get an older trade from the database and delete it from the database
  //  - Calculate the rate of return between those two trades
  //  - Insert a RateOfReturn instance into the database
  //  - Get the past 24 hours of rate of return data from the database
  //  - Calculate the standard deviation of the rate of return dataset
  //  - Serve up the calculated standard deviation over a WebSocket server
  webSocketClient.on('message', rawMessage => {
    const newTrade = Trade.parseMessage(rawMessage);
    if (!!newTrade.price && !!newTrade.timeStamp) {
      // The new trade will be needed in the database for calculating a
      // rate of return later, but we do not need to wait for the database
      // insertion to finish before continuing
      Trade.insert(newTrade, database);

        // Get an earlier trade in order to compare with the new trade to
        //  calculate a rate of return, and delete the earlier trade from the
        //  database because it will not be needed again.
        // In the case where many new trades arrive with the same timestamp,
        //  we might not be able to find any trades with a lesser timestamp
        //  than a given one of those. The new trades will still be inserted
        //  into the database, but a new rate of return will not be calculated.
        //  Initially, this will cause the database count to grow in size, but
        //  the growth will reduce as a pool of earlier trades becomes available
        //  in the database. This means a couple of things:
        //    1. The rate of return is not necessarily calculated between
        //       adjacent trades, but sometimes is calculated across a time
        //       period spanning multiple trades.
        //    2. A few trade data points will not be included in the aggregate
        //       calculation of standard deviation of many rates of return. This
        //       slightly reduces the accuracy of the calculation. Once this is
        //       in production, we should be able to measure that inaccuracy
        //       by comparing the number of ignored data points to the total
        //       number of data points.
        database.collection(TRADES_COLLECTION)
        .findOneAndDelete({ timeStamp: { $lt: newTrade.timeStamp } })
        .then((oldTrade) => {
          return new RateOfReturn({
            initialTrade: oldTrade.value,
            finalTrade: newTrade
          });
        })
        .then((rateOfReturn) => {
          return RateOfReturn.insert(rateOfReturn, database)
        })
        .then(() => {
          return RateOfReturn.getTrailing({ hours: 24, db: database });
        })
        .then((trailingRatesOfReturn) => {
          const volatility = Statistics.standardDeviation(trailingRatesOfReturn);
          const volatilityMessage = JSON.stringify({ volatility: volatility });
          webSocketServer.clients.forEach((client) => {
            client.send(volatilityMessage);
          });
        });
      }
    });
});
