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

      // Start with an empty database for each test
      db.collection(TRADES_COLLECTION).drop();
      done();
    });
  });

  it('inserts a trade into the database', (done) => {
    const trade = { price: 6323.7, timeStamp: 1509458089 };
    db.collection(TRADES_COLLECTION).count()
    .then((count) => {
      const initialCount = count;
      Trade.insert(trade, db)
      .then((newTrade) => {
        expect(newTrade.price).to.equal(6323.7);
        expect(newTrade.timeStamp).to.equal(1509458089);
        db.collection(TRADES_COLLECTION).count()
        .then((count) => {
          const afterCount = count;
          expect(afterCount).to.eql(initialCount + 1);
          done();
        });
      });
    });
  });

  it('calculates the instantaneous rate of return', (done) => {
    // This rate is defined as the percentage change in US Dollars per second.
    // Test for a positive rate of return.
    // In the following test case, the price increases by five percent over ten seconds,
    // resulting in a rate of .05 / 10 = 0.005, or 0.5 % per second.
    const positiveReturnInitialTrade = { price: 100, timeStamp: 1500000000 };
    const positiveReturnFinalTrade = { price: 105, timeStamp: 1500000010 };
    const positiveReturn = Trade.rateOfReturn({
      initialTrade: positiveReturnInitialTrade,
      finalTrade: positiveReturnFinalTrade
    });
    expect(positiveReturn).to.equal(0.005);

    // Test for a negative rate of return.
    const negativeReturnInitialTrade = { price: 100, timeStamp: 1500000000 };
    const negativeReturnFinalTrade = { price: 95, timeStamp: 1500000010 };
    const negativeReturn = Trade.rateOfReturn({
      initialTrade: negativeReturnInitialTrade,
      finalTrade: negativeReturnFinalTrade
    });
    expect(negativeReturn).to.equal(-0.005);
  });
});
