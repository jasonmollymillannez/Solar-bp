MTN Mobile Money Integration Guide

- Place your MTN MoMo API key in .env as MTN_MOMO_API_KEY and MTN_MOMO_USER_ID.
- For payouts set MOBILE_MONEY_PAYOUT_ENABLED=true and configure Docker secrets for certificates if required.
- Callback URL for payment confirmations: POST /api/v1/purchases/webhook/momo
  - Provider should send JSON:
    {
      "provider_reference": "...",
      "purchase_id": "...",
      "status": "SUCCESS"
    }
- Verify signature using provider docs and implement in backend/src/services/mobileMoneyService.js
