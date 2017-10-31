const mongodb = require('mongodb');
const mongoDbUri = require('../secrets/testDatabaseUri');
const { expect } = require('chai');
const Trade = require('../models/Trade');
const TRADES_COLLECTION = require('../config/trade_db_collection');

describe('Interacting with the trades database', () => {
  let db;

  beforeEach((done) => {
    mongodb.MongoClient.connect(mongoDbUri, (err, database) => {
      if (err) {
        console.log('There was an error connecting to the database.');
        console.log(err);
      }
      db = database;
      done();
    });
  });

  it('inserts a trade into the database', (done) => {
    const trade = { tradePrice: 6323.7, timeStamp: 1509458089 };
    db.collection(TRADES_COLLECTION).count()
    .then((count) => {
      const initialCount = count;
      Trade.insert(trade, db)
      .then((newTrade) => {
        expect(newTrade.tradePrice).to.equal(6323.7);
        expect(newTrade.timeStamp).to.equal(1509458089);
        db.collection(TRADES_COLLECTION).count()
        .then((count) => {
          const afterCount = count;
          expect(afterCount).to.eql(initialCount + 1)
          done();
        });
      });
    });
  });
});
