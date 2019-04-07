const { expect } = require('chai');
const Statistics = require('../lib/Statistics');

describe('Statistical calculations', () => {
  it('calculates the standard deviation of a set of prices', () => {
    const prices = [
      6406.1,
      6419.1,
      6418.804928,
      6418.9,
      6419.2,
    ];
    const stDev = Statistics.standardDeviation(prices);
    // This test expects the result to be rounded to 6 decimal places, even though
    // the actual result typically would have many more decimal places after that.
    // This particular level of precision is somewhat arbitrary and can be
    // changed in the future.
    expect(stDev).to.equal(5.771730);
  });
});
