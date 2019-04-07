class Statistics {
  static standardDeviation(prices) {
    const count = Statistics.count(prices);
    const mean = Statistics.mean(prices);
    const sumOfSquaredDifferences = prices.reduce((sum, price) => {
      const difference = (price - mean);
      const squaredDifference = Math.pow(difference, 2);
      return sum + squaredDifference;
    }, 0)
    const variance = sumOfSquaredDifferences / (count - 1);
    const standardDeviation = Math.sqrt(variance);
    const roundedStandardDeviation = Math.round(standardDeviation * 1000000) / 1000000;
    return roundedStandardDeviation;
  }

  static count(prices) {
    return prices.length;
  }

  static total(prices) {
    return prices.reduce((sum, price) => {
      return sum + price;
    }, 0);
  }

  static mean(prices) {
    const total = Statistics.total(prices);
    const count = Statistics.count(prices);
    return (total / count);
  }
}

module.exports = Statistics;
