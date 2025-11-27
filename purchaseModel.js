/**
 * Purchase model
 */
const knex = require('../config/db');

async function createPurchase({ id, user_id, product_id, price_ghc, started_at, status = 'pending' }) {
  const now = new Date();
  await knex('purchases').insert({
    id,
    user_id,
    product_id,
    price_ghc,
    status,
    started_at: started_at || null,
    recovered_amount: 0.00,
    created_at: now
  });
  return getPurchaseById(id);
}

async function getPurchasesByUser(user_id) {
  return knex('purchases').where({ user_id }).select();
}

async function getPurchaseById(id) {
  return knex('purchases').where({ id }).first();
}

async function markPurchasePaidDaily(id, amount, paid_at) {
  await knex.transaction(async trx => {
    const purchase = await trx('purchases').where({ id }).first();
    if (!purchase) throw new Error('Purchase not found');
    const newRecovered = parseFloat(purchase.recovered_amount) + parseFloat(amount);
    await trx('purchases').where({ id }).update({
      recovered_amount: newRecovered,
      status: newRecovered >= purchase.price_ghc ? 'completed' : purchase.status
    });
  });
  return getPurchaseById(id);
}

module.exports = { createPurchase, getPurchasesByUser, getPurchaseById, markPurchasePaidDaily };
