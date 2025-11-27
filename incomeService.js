/**
 * Daily income computation and payout functions
 */
const { v4: uuidv4 } = require('uuid');
const productModel = require('../models/productModel');
const purchaseModel = require('../models/purchaseModel');
const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');
const { calculateDailyPayout } = require('../utils/incomeCalculator');
const knex = require('../config/db');

async function calculateDailyPayoutForPrice(price) {
  return calculateDailyPayout(price);
}

async function creditDailyPayouts(date = new Date()) {
  // Find all active purchases
  const purchases = await knex('purchases').where({ status: 'active' }).select();
  for (const p of purchases) {
    const product = await productModel.getProductById(p.product_id);
    if (!product) continue;
    // compute daily payout amount
    const { daily_payout } = calculateDailyPayout(product.price_ghc, 18);
    const payoutAmount = parseFloat(daily_payout.toFixed(2));
    // Log transaction and credit user
    const user = await userModel.getUserById(p.user_id);
    if (!user) continue;
    const before = parseFloat(user.wallet_balance || 0.0);
    const after = parseFloat((before + payoutAmount).toFixed(2));
    await userModel.updateUser(user.id, { wallet_balance: after });
    await transactionModel.logTransaction({
      id: uuidv4(),
      user_id: user.id,
      type: 'payout',
      amount: payoutAmount,
      balance_before: before,
      balance_after: after,
      metadata: { purchase_id: p.id, date: date.toISOString() }
    });
    // Update purchase recovered amount and status
    await purchaseModel.markPurchasePaidDaily(p.id, payoutAmount, date);
  }
  return { credited: purchases.length };
}

module.exports = { calculateDailyPayoutForPrice, creditDailyPayouts };
