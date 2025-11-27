/**
 * Admin controllers: dashboard summary
 */
const knex = require('../config/db');

async function dashboardSummary(req, res, next) {
  try {
    const users_count = parseInt((await knex('users').count('id as cnt').first()).cnt, 10) || 0;
    const active_products_count = parseInt((await knex('products').where({ active: true }).count('id as cnt').first()).cnt, 10) || 0;
    const total_deposited = parseFloat(((await knex('transactions').where({ type: 'purchase' }).sum('amount as s').first()).s) || 0.0);
    const pending_withdrawals_count = parseInt((await knex('withdrawals').where({ status: 'requested' }).count('id as cnt').first()).cnt, 10) || 0;
    const todays_payouts_total = parseFloat(((await knex('transactions').where({ type: 'payout' }).andWhere('created_at', '>=', new Date(new Date().setHours(0,0,0,0))).sum('amount as s').first()).s) || 0.0);
    res.json({ users_count, active_products_count, total_deposited, pending_withdrawals_count, todays_payouts_total });
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboardSummary };
