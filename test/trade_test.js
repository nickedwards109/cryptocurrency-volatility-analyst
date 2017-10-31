const mongodb = require('mongodb');
const mongoDbUri = require('../secrets/testDatabaseUri');

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

  // it(' ', () => {
  //
  // });
});
