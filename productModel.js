/**
 * Product model
 */
const knex = require('../config/db');

async function createProduct({ id, name, price_ghc, daily_payout_amount, description, active = true }) {
  await knex('products').insert({
    id,
    name,
    price_ghc,
    daily_payout_amount,
    description: description || null,
    active
  });
  return getProductById(id);
}

async function getProductById(id) {
  return knex('products').where({ id }).first();
}

async function listProducts() {
  return knex('products').where({ active: true }).select();
}

async function updateProduct(id, updates) {
  await knex('products').where({ id }).update(updates);
  return getProductById(id);
}

module.exports = { createProduct, getProductById, listProducts, updateProduct };
