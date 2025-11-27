/**
 * User model using Knex
 */
const knex = require('../config/db');

async function createUser({ id, email, phone, password_hash, full_name, referrer_id, created_at }) {
  const now = created_at || new Date();
  await knex('users').insert({
    id,
    email,
    phone,
    password_hash,
    full_name: full_name || null,
    referrer_id: referrer_id || null,
    wallet_balance: 0.00,
    wallet_on_hold: 0.00,
    is_admin: false,
    email_verified: false,
    created_at: now
  });
  return getUserById(id);
}

async function getUserById(id) {
  return knex('users').where({ id }).first();
}

async function getUserByEmail(email) {
  return knex('users').where({ email }).first();
}

async function getUserByPhone(phone) {
  return knex('users').where({ phone }).first();
}

async function updateUser(id, updates) {
  await knex('users').where({ id }).update(updates);
  return getUserById(id);
}

module.exports = { createUser, getUserById, getUserByEmail, getUserByPhone, updateUser };
