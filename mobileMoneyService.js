/**
 * Mobile money integration service skeleton.
 * This implementation contains placeholders and simulated responses
 * for local development and testing. For production, implement real API calls.
 */
const axios = require('axios');
const config = require('../config/momo');
const { v4: uuidv4 } = require('uuid');

async function createPaymentRequest({ user, product, callbackUrl }) {
  // In production, call MTN MoMo API to create payment request.
  // Here, simulate by returning a redirect URL and provider reference.
  const provider_reference = `LOCALMOCK-${uuidv4()}`;
  const payment_url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/mock-pay?ref=${provider_reference}`;
  return { provider_reference, payment_url };
}

function verifyPaymentCallback(reqHeaders, body) {
  // In production verify signature headers using provider secret.
  // For local dev we accept payloads with { status: 'SUCCESS' }
  return body && body.status === 'SUCCESS';
}

async function payout({ withdrawal }) {
  // For real payouts, call provider payout endpoints
  if (!config.MTN_MOMO.payoutEnabled) {
    return { status: 'mocked', provider_reference: `MOCK-PAYOUT-${uuidv4()}` };
  }
  // Implement real payout request here using axios and MTN credentials
  throw new Error('Payout not implemented for production in this template');
}

module.exports = { createPaymentRequest, verifyPaymentCallback, payout };
