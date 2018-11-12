const mongodb = require('mongodb');
const mongoDbUri = require('../secrets/testDatabaseUri');
const { expect } = require('chai');
const Trade = require('../models/Trade');
const TRADES_COLLECTION = require('../config/db_collections');

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

  it('gets the prices out of a set of trades', () => {
    const trades = [
      {
        price: 6455.9,
        timeStamp: 1541988027.358
      },
      {
        price: 6455.6,
        timeStamp: 1541988042.725
      },
      {
        price: 6455.2,
        timeStamp: 1541988058.372
      }
    ];
    const prices = Trade.getPrices(trades);
    expect(prices[0]).to.equal(6455.9);
    expect(prices[1]).to.equal(6455.6);
    expect(prices[2]).to.equal(6455.2)
  });
});
