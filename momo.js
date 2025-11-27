/**
 * Mobile Money configuration placeholder
 * Real keys should be set in environment or Docker secrets
 */
module.exports = {
  MTN_MOMO: {
    apiUrl: process.env.MTN_MOMO_API_URL || 'https://sandbox.mtn.com',
    apiKeyEnvName: 'MTN_MOMO_API_KEY',
    userIdEnvName: 'MTN_MOMO_USER_ID',
    payoutEnabled: (process.env.MOBILE_MONEY_PAYOUT_ENABLED || 'false') === 'true'
  }
};
