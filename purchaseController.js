/**
 * Purchase handlers and webhook processing
 */
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const purchaseModel = require('../models/purchaseModel');
const productModel = require('../models/productModel');
const mobileMoneyService = require('../services/mobileMoneyService');
const referralService = require('../services/referralService');
const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');

async function initiatePurchase(req, res, next) {
  try {
    const schema = Joi.object({
      product_id: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

    const product = await productModel.getProductById(value.product_id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const id = uuidv4();
    const purchase = await purchaseModel.createPurchase({
      id,
      user_id: req.user.id,
      product_id: product.id,
      price_ghc: product.price_ghc,
      status: 'pending'
    });

    const callbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/webhook/momo`;
    const payment = await mobileMoneyService.createPaymentRequest({ user: req.user, product, callbackUrl });

    // store provider ref in transactions metadata for traceability
    await transactionModel.logTransaction({
      id: uuidv4(),
      user_id: req.user.id,
      type: 'purchase',
      amount: product.price_ghc,
      balance_before: req.user.wallet_balance || 0.0,
      balance_after: req.user.wallet_balance || 0.0,
      metadata: { purchase_id: purchase.id, provider_reference: payment.provider_reference }
    });

    res.json({ purchase_id: purchase.id, payment_url: payment.payment_url, provider_reference: payment.provider_reference });
  } catch (err) {
    next(err);
  }
}

async function confirmPurchaseWebhook(req, res, next) {
  try {
    const body = req.body;
    // verify callback
    const ok = mobileMoneyService.verifyPaymentCallback(req.headers, body);
    if (!ok) return res.status(400).json({ error: 'Invalid callback' });

    // body expected to contain provider_reference and status and purchase_id in metadata
    const providerRef = body.provider_reference || body.reference;
    const purchaseId = body.purchase_id || (body.metadata && body.metadata.purchase_id);
    if (!purchaseId) {
      return res.status(400).json({ error: 'Missing purchase_id' });
    }
    const purchase = await purchaseModel.getPurchaseById(purchaseId);
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });

    // mark active
    await require('knex')('purchases').where({ id: purchaseId }).update({ status: 'active', started_at: new Date() });

    // credit nothing to wallet now; payouts happen daily. But record transaction with provider ref
    await transactionModel.logTransaction({
      id: uuidv4(),
      user_id: purchase.user_id,
      type: 'purchase',
      amount: purchase.price_ghc,
      balance_before: (await userModel.getUserById(purchase.user_id)).wallet_balance || 0.0,
      balance_after: (await userModel.getUserById(purchase.user_id)).wallet_balance || 0.0,
      metadata: { provider_reference: providerRef, purchase_id: purchaseId }
    });

    // allocate referral bonus if applicable
    await referralService.allocateOnPurchase(purchase);

    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}

async function listUserPurchases(req, res, next) {
  try {
    const purchases = await purchaseModel.getPurchasesByUser(req.user.id);
    res.json({ purchases });
  } catch (err) {
    next(err);
  }
}

async function getPurchase(req, res, next) {
  try {
    const p = await purchaseModel.getPurchaseById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    if (p.user_id !== req.user.id && !req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });
    res.json({ purchase: p });
  } catch (err) {
    next(err);
  }
}

module.exports = { initiatePurchase, confirmPurchaseWebhook, listUserPurchases, getPurchase };
