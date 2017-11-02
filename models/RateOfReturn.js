class RateOfReturn {
  constructor(tradePair) {
    const initialPrice = tradePair.initialTrade.price;
    const finalPrice = tradePair.finalTrade.price;
    const priceChangePercentage = (finalPrice - initialPrice) / initialPrice;

    const initialTimeStamp = tradePair.initialTrade.timeStamp;
    const finalTimeStamp = tradePair.finalTrade.timeStamp;
    const intervalSeconds = finalTimeStamp - initialTimeStamp;

    this.rate = (priceChangePercentage / intervalSeconds);
  }
}

module.exports = RateOfReturn;
