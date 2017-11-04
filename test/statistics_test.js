const mongodb = require('mongodb');
const mongoDbUri = require('../secrets/testDatabaseUri');
const { expect } = require('chai');
const Statistics = require('../lib/Statistics');

describe('Statistical calculations', () => {
  it('calculates the standard deviation of a set of rates of return', () => {
    const returns = [
      { rate: 0.8 },
      { rate: -0.1 },
      { rate: 0.3 },
      { rate: 0.8 },
      { rate: -0.9 },
    ];
    const stDev = Statistics.standardDeviation(returns);
    // The mathematically accurate result is 0.257049
    // But, due to floating point arithmetic, the calculated result is 0.25704900000000014
    // So, the test doesn't expect an exact number, but expects a number
    // within +/- 0.0000001 of the mathematically accurate result.
    expect(stDev).to.be.above(0.2570489);
    expect(stDev).to.be.below(0.2570491);
  });
});
