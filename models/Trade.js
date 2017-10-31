const TRADES_COLLECTION = 'trades';

class Trade {
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
    // Deserialize the message string
    const message = JSON.parse(rawMessage);

    let tradeObject = {};

    // If the message represents a trade that was executed...
    if (message[1] === "te") {

      // Get the trade price
      const tradeDatum = message[2];
      const tradePrice = tradeDatum[3];

      // Get the timestamp (an integer representing milliseconds in the Unix epoch)
      const timeStamp = tradeDatum[1];

      tradeObject.tradePrice = tradePrice;
      tradeObject.timeStamp = timeStamp;
    }
    return tradeObject;
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
