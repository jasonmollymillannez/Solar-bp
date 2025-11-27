/**
 * Utility to calculate daily payout using Big.js for precision.
 * daily_payout = priceGhc / daysToRecover (default 18)
 */
const Big = require('big.js');

function calculateDailyPayout(priceGhc, daysToRecover = 18) {
  if (priceGhc == null) throw new Error('priceGhc required');
  const price = new Big(priceGhc);
  const days = new Big(daysToRecover);
  const daily = price.div(days);
  // return with 4 decimal places
  return {
    daily_payout: parseFloat(daily.round(4, 0).toString()),
    daysToRecover: parseInt(daysToRecover, 10)
  };
}

module.exports = { calculateDailyPayout };
