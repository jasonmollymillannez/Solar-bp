/**
 * Withdrawal endpoints
 */
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const withdrawalModel = require('../models/withdrawalModel');
const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');
const mobileMoneyService = require('../services/mobileMoneyService');

async function requestWithdrawal(req, res, next) {
  try {
    const schema = Joi.object({
      amount: Joi.number().positive().required(),
      mobile_number: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

    const user = req.user;
    const amount = parseFloat(value.amount);
    if (amount <= 0) return res.status(400).json({ error: 'Amount must be positive' });
    if (amount > parseFloat(user.wallet_balance || 0)) return res.status(400).json({ error: 'Insufficient funds' });

    // Create withdrawal record
    const withdrawal = await withdrawalModel.createWithdrawal({
      id: uuidv4(),
      user_id: user.id,
      amount,
      method: 'mobile_money'
    });

    // Hold funds by decrementing wallet_balance (simple approach)
    const before = parseFloat(user.wallet_balance || 0.0);
    const after = parseFloat((before - amount).toFixed(2));
    await userModel.updateUser(user.id, { wallet_balance: after });

    await transactionModel.logTransaction({
      id: uuidv4(),
      user_id: user.id,
      type: 'withdrawal',
      amount,
      balance_before: before,
      balance_after: after,
      metadata: { withdrawal_id: withdrawal.id, mobile_number: value.mobile_number }
    });

    res.json({ withdrawal });
  } catch (err) {
    next(err);
  }
}

async function listUserWithdrawals(req, res, next) {
  try {
    const items = await require('../config/db')('withdrawals').where({ user_id: req.user.id }).orderBy('requested_at', 'desc');
    res.json({ withdrawals: items });
  } catch (err) {
    next(err);
  }
}

// Admin approve payout (simulate)
async function approveWithdrawal(req, res, next) {
  try {
    const id = req.params.id;
    const withdrawal = await withdrawalModel.getWithdrawalById(id);
    if (!withdrawal) return res.status(404).json({ error: 'Not found' });
    // mark approved
    await withdrawalModel.approveWithdrawal(id, 'approved-by-admin');
    // perform mock payout
    const payoutResult = await mobileMoneyService.payout({ withdrawal });
    // mark paid
    await require('../config/db')('withdrawals').where({ id }).update({ status: 'paid', provider_reference: payoutResult.provider_reference, processed_at: new Date() });
    res.json({ status: 'paid', provider_reference: payoutResult.provider_reference });
  } catch (err) {
    next(err);
  }
}

async function rejectWithdrawal(req, res, next) {
  try {
    const id = req.params.id;
    const { reason } = req.body || {};
    const w = await withdrawalModel.getWithdrawalById(id);
    if (!w) return res.status(404).json({ error: 'Not found' });
    await withdrawalModel.rejectWithdrawal(id, reason || 'rejected');
    // refund user
    const user = await userModel.getUserById(w.user_id);
    const before = parseFloat(user.wallet_balance || 0.0);
    const after = parseFloat((before + parseFloat(w.amount)).toFixed(2));
    await userModel.updateUser(user.id, { wallet_balance: after });
    await transactionModel.logTransaction({
      id: uuidv4(),
      user_id: user.id,
      type: 'withdrawal',
      amount: 0,
      balance_before: before,
      balance_after: after,
      metadata: { refunded_withdrawal: id }
    });
    res.json({ status: 'rejected' });
  } catch (err) {
    next(err);
  }
}

module.exports = { requestWithdrawal, listUserWithdrawals, approveWithdrawal, rejectWithdrawal };
