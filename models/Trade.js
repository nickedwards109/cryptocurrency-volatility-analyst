const TRADES_COLLECTION = 'trades';

class Trade {
  static handleMessage(rawMessage, db) {
    const trade = Trade.parseMessage(rawMessage);
    if (!!trade.tradePrice && !!trade.timeStamp) {
      Trade.insert(trade, db);
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
    db.collection(TRADES_COLLECTION).insertOne(trade, (err, doc) => {
      if (err) {
        console.log('There was an error inserting the trade into the database.')
        console.log(err)
      } else {
        console.log('Inserted a trade into the database.')
        console.log(doc.ops[0])
        // This logs a message that looks something like:
        // Inserted a trade into the database.
        // { tradePrice: 5710.1,
        //   timeStamp: 1509215064,
        //   _id: 59f4cb581f6f7c4c29957f56 }
      }
    });
  }
}

module.exports = Trade;
