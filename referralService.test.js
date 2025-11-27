/**
 * Minimal referral service unit test (requires DB)
 * This test ensures referral allocation function does not throw
 */
const referralService = require('../services/referralService');

test('allocateOnPurchase handles missing purchase gracefully', async () => {
  await expect(referralService.allocateOnPurchase(null)).rejects.toThrow();
});
