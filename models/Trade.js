const RateOfReturn = require('./RateOfReturn');
const TRADES_COLLECTION = require('../config/db_collections').trades;

class Trade {
  constructor(args) {
    this.price = args.price;
    this.timeStamp = args.timeStamp;
  }

  static handleMessage(rawMessage, db) {
    const newTrade = Trade.parseMessage(rawMessage);
    if (!!newTrade.price && !!newTrade.timeStamp) {
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
        db.collection(TRADES_COLLECTION)
        .findOneAndDelete({ timeStamp: { $lt: newTrade.timeStamp } })
        .then((oldTrade) => {
          return new RateOfReturn({
            initialTrade: oldTrade.value,
            finalTrade: newTrade
          });
        })
        .then((rateOfReturn) => {
          return RateOfReturn.insert(rateOfReturn, db)
        })
        .then(() => {
          // The new trade will be needed in the database for calculating a
          // rate of return later, but we do not need to wait for the database
          // insertion to finish before sending a calculated result as a
          // message across the WebSocket server
          Trade.insert(newTrade, db);

          // Next task is to analyze the aggregate rate of return data
        });
    }
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
          console.log('Inserted a trade into the database.');
          console.log(createdTrade);
          resolve(createdTrade);
        }
      });
    });
  }

  static rateOfReturn(tradePair) {
    const initialPrice = tradePair.initialTrade.price;
    const finalPrice = tradePair.finalTrade.price;
    const priceChangePercentage = (finalPrice - initialPrice) / initialPrice;

    const initialTimeStamp = tradePair.initialTrade.timeStamp;
    const finalTimeStamp = tradePair.finalTrade.timeStamp;
    const intervalSeconds = finalTimeStamp - initialTimeStamp;

    return (priceChangePercentage / intervalSeconds);
  }
}

module.exports = Trade;
