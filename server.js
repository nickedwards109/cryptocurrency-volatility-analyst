'use strict';

const apiUrl = require('./config/apiUrl');

const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = express()
  .listen(PORT, () => console.log(`Listening on port ${PORT}`))

const webSocketClient = new WebSocket(apiUrl, {
  perMessageDeflate: false
});

webSocketClient.on('open', () => {
  console.log('Connection opened!')
});

webSocketClient.on('message', (data) => {
  console.log(data);
});
