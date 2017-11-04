const RATES_OF_RETURN_COLLECTION = require('../config/db_collections').ratesOfReturn;

class RateOfReturn {
  constructor(tradePair) {
    const initialPrice = tradePair.initialTrade.price;
    const finalPrice = tradePair.finalTrade.price;
    const priceChangePercentage = (finalPrice - initialPrice) / initialPrice;

    const initialTimeStamp = tradePair.initialTrade.timeStamp;
    const finalTimeStamp = tradePair.finalTrade.timeStamp;
    const intervalSeconds = finalTimeStamp - initialTimeStamp;

    this.rate = (priceChangePercentage / intervalSeconds);
    this.timeStamp = finalTimeStamp;
  }

  static insert(rateOfReturn, db) {
    return new Promise((resolve, reject) => {
      db.collection(RATES_OF_RETURN_COLLECTION).insertOne(rateOfReturn, (err, doc) => {
        if (err) {
          console.log('There was an error inserting the trade into the database.');
          console.log(err)
          reject(err);
        } else {
          const createdRateOfReturn = doc.ops[0];
          console.log('Inserted a rate of return into the database.');
          console.log(createdRateOfReturn);
          resolve(createdRateOfReturn);
        }
      });
    });
  }

  static getTrailing(args) {
    const hours = args.hours;
    const db = args.db;
    const nowTime = Math.floor(Date.now() / 1000);
    const trailingTimeLimit = nowTime - hours*60*60;
    return new Promise((resolve, reject) => {
      db.collection(RATES_OF_RETURN_COLLECTION).find(
        { timeStamp: { $gt: trailingTimeLimit } }
      )
      .toArray((err, results) => {
        if (err) {
          console.log('There was an error getting trailing returns from the database.');
          console.log(err);
          reject(err);
        } else {
          resolve(results)
        }
      });
    })
  }
}

module.exports = RateOfReturn;
