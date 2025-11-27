/**
 * Transaction model
 */
const knex = require('../config/db');

async function logTransaction({ id, user_id, type, amount, balance_before, balance_after, metadata, created_at }) {
  const now = created_at || new Date();
  await knex('transactions').insert({
    id,
    user_id,
    type,
    amount,
    balance_before,
    balance_after,
    metadata: metadata || null,
    created_at: now
  });
  return getTransactionById(id);
}

async function getTransactionsByUser(user_id, limit = 50, offset = 0) {
  return knex('transactions').where({ user_id }).orderBy('created_at', 'desc').limit(limit).offset(offset);
}

async function getTransactionById(id) {
  return knex('transactions').where({ id }).first();
}

module.exports = { logTransaction, getTransactionsByUser, getTransactionById };
