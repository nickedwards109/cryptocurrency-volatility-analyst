'use strict';

const streamingEndpoint = require('./config/streaming_endpoint');
const mongoDbUri = process.env.MONGODB_URI;
const Trade = require('./models/Trade');

const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const mongodb = require('mongodb');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Create a database variable outside of the database connetion callback
// in order to reuse the connection pool.
let db;

// Create an Express server
let server = express();

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(mongoDbUri, (err, database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  server
    .use((request, response) => {response.sendFile(INDEX)})
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
})

// Create a WebSocket client which will connect with a streaming endpoint
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

// When the streaming endpoint sends a message over the WebSocket connection,
// hand over the message to the Trade class, where it will parse the message
// and insert a trade object into the database.
webSocketClient.on('message', rawMessage => {
  Trade.handleMessage(rawMessage, db);
});
