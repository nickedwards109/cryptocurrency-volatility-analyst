const { expect } = require('chai');
const RateOfReturn = require('../models/RateOfReturn');

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
