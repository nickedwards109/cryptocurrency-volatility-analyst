'use strict';

const apiUrl = require('./config/apiUrl');

const WebSocket = require('ws');

const webSocketClient = new WebSocket(apiUrl, {
  perMessageDeflate: false
});

webSocketClient.on('open', () => {
  console.log('Connection opened!')
});

webSocketClient.on('message', (data) => {
  console.log(data);
});
