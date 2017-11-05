class Statistics {
  static standardDeviation(ratesOfReturn) {
    const count = Statistics.count(ratesOfReturn);
    const mean = Statistics.mean(ratesOfReturn);
    const sumOfSquaredDifferences = ratesOfReturn.reduce((sum, element) => {
      const rate = parseFloat(element.rate);
      const difference = (rate - mean);
      const squaredDifference = Math.pow(difference, 2);
      return sum + squaredDifference;
    }, 0)
    const variance = sumOfSquaredDifferences / (count - 1);
    return Math.pow(variance, 2);
  }

  static count(ratesOfReturn) {
    return ratesOfReturn.length;
  }

  static total(ratesOfReturn) {
    return ratesOfReturn.reduce((sum, element) => {
      return sum + parseFloat(element.rate);
    }, 0);
  }

  static mean(ratesOfReturn) {
    const total = Statistics.total(ratesOfReturn);
    const count = Statistics.count(ratesOfReturn);
    return (total / count);
  }
}

module.exports = Statistics;
