const knex = require('../config/db');

async function createWithdrawal({ id, user_id, amount, status = 'requested', method = 'mobile_money', provider_reference = null, requested_at }) {
  const now = requested_at || new Date();
  await knex('withdrawals').insert({
    id,
    user_id,
    amount,
    status,
    method,
    provider_reference,
    requested_at: now
  });
  return getWithdrawalById(id);
}

async function getPendingWithdrawals() {
  return knex('withdrawals').where({ status: 'requested' }).select();
}

async function getWithdrawalById(id) {
  return knex('withdrawals').where({ id }).first();
}

async function approveWithdrawal(id, processor_notes) {
  await knex('withdrawals').where({ id }).update({
    status: 'approved',
    processed_at: new Date()
  });
  return getWithdrawalById(id);
}

async function rejectWithdrawal(id, reason) {
  await knex('withdrawals').where({ id }).update({ status: 'rejected', processed_at: new Date(), admin_notes: reason });
  return getWithdrawalById(id);
}

module.exports = { createWithdrawal, getPendingWithdrawals, getWithdrawalById, approveWithdrawal, rejectWithdrawal };
