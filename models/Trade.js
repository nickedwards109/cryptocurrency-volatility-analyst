const TRADES_COLLECTION = 'trades';

export default class Trade {
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
