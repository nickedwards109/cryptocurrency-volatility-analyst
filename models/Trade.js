const Statistics = require('../lib/Statistics');
const TRADES_COLLECTION = require('../config/db_collections');

class Trade {
  constructor(args) {
    this.price = args.price;
    this.timeStamp = args.timeStamp;
  }

  static parseMessage(rawMessage) {
    const message = JSON.parse(rawMessage);
    let price, timeStamp;
    // If the message represents a trade that was executed...
    if (message[1] === "te") {
      // Get the trade price and timeStamp (an integer representing seconds in the Unix epoch)
      const tradeDatum = message[2];
      price = tradeDatum[3];
      timeStamp = tradeDatum[1] / 1000;
    }
    return new Trade({price: price, timeStamp: timeStamp});
  }

  static insert(trade, db) {
    return new Promise((resolve, reject) => {
      db.collection(TRADES_COLLECTION).insertOne(trade, (err, doc) => {
        if (err) {
          console.log('There was an error inserting the trade into the database.');
          console.log(err)
          reject(err);
        } else {
          const createdTrade = doc.ops[0];
          resolve(createdTrade);
        }
      });
    });
  }

  static getPrices(trades) {
    return trades.map((trade) => {
      return trade.price;
    });
  }
}

module.exports = Trade;
