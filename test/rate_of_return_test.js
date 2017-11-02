const mongodb = require('mongodb');
const mongoDbUri = require('../secrets/testDatabaseUri');
const { expect } = require('chai');
const RateOfReturn = require('../models/RateOfReturn');
const RATES_OF_RETURN_COLLECTION = require('../config/db_collections').ratesOfReturn;

describe('Rates of return', () => {
  it('calculates the instantaneous rate of return', () => {
    // This rate is defined as the percentage change in US Dollars per second.
    // Test for a positive rate of return.
    // In the following test case, the price increases by five percent over ten seconds,
    // resulting in a rate of .05 / 10 = 0.005, or 0.5 % per second.
    const positiveReturnInitialTrade = { price: 100, timeStamp: 1500000000 };
    const positiveReturnFinalTrade = { price: 105, timeStamp: 1500000010 };
    const positiveReturn = new RateOfReturn({
      initialTrade: positiveReturnInitialTrade,
      finalTrade: positiveReturnFinalTrade
    });
    expect(positiveReturn.rate).to.equal(0.005);

    // Test for a negative rate of return.
    const negativeReturnInitialTrade = { price: 100, timeStamp: 1500000000 };
    const negativeReturnFinalTrade = { price: 95, timeStamp: 1500000010 };
    const negativeReturn = new RateOfReturn({
      initialTrade: negativeReturnInitialTrade,
      finalTrade: negativeReturnFinalTrade
    });
    expect(negativeReturn.rate).to.equal(-0.005);
  });
});

describe('Interacting with the rate of return database', () => {
  let db;

  beforeEach((done) => {
    mongodb.MongoClient.connect(mongoDbUri, (err, database) => {
      if (err) {
        console.log('There was an error connecting to the database.');
        console.log(err);
      }
      db = database;

      // Start with an empty database for each test
      db.collection(RATES_OF_RETURN_COLLECTION).drop();
      done();
    });
  });

  it('inserts a rate of return into the database', (done) => {
    const initialTrade = { price: 100, timeStamp: 1500000000 };
    const finalTrade = { price: 105, timeStamp: 1500000010 };
    const rateOfReturn = new RateOfReturn({
      initialTrade: initialTrade,
      finalTrade: finalTrade
    })
    db.collection(RATES_OF_RETURN_COLLECTION).count()
    .then((count) => {
      const initialCount = count;
      RateOfReturn.insert(rateOfReturn, db)
      .then((newRateOfReturn) => {
        expect(newRateOfReturn.rate).to.equal(0.005);
        db.collection(RATES_OF_RETURN_COLLECTION).count()
        .then((count) => {
          const afterCount = count;
          expect(afterCount).to.eql(initialCount + 1);
          done();
        });
      });
    });
  });
})
