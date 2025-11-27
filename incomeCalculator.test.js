const { calculateDailyPayout } = require('../src/utils/incomeCalculator');

test('daily payouts mapping', () => {
  expect(calculateDailyPayout(70).daily_payout).toBeCloseTo(3.8889, 4);
});
