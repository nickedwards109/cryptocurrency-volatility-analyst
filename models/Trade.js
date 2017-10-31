const TRADES_COLLECTION = 'trades';

class Trade {
  constructor(args) {
    this.tradePrice = args.tradePrice;
    this.timeStamp = args.timeStamp;
  }

  static handleMessage(rawMessage, db) {
    const trade = Trade.parseMessage(rawMessage);
    if (!!trade.tradePrice && !!trade.timeStamp) {
      Trade.insert(trade, db)
      .then(() => {
        console.log('Hello from the callback that is executed after a trade is inserted')
      });
    }
  }

  static parseMessage(rawMessage) {
    const message = JSON.parse(rawMessage);
    let tradePrice, timeStamp;
    // If the message represents a trade that was executed...
    if (message[1] === "te") {
      // Get the trade price and timeStamp (an integer representing seconds in the Unix epoch)
      const tradeDatum = message[2];
      tradePrice = tradeDatum[3];
      timeStamp = tradeDatum[1] / 1000;
    }
    return new Trade({tradePrice: tradePrice, timeStamp: timeStamp});
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
          console.log('Inserted a trade into the database.');
          console.log(createdTrade);
          resolve(createdTrade);
        }
      });
    });
  }
}

module.exports = Trade;
