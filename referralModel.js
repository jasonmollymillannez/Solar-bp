const knex = require('../config/db');

async function createReferral({ id, inviter_id, invitee_id, purchase_id, bonus_amount, created_at }) {
  const now = created_at || new Date();
  await knex('referrals').insert({
    id,
    inviter_id,
    invitee_id,
    purchase_id,
    bonus_amount,
    paid: false,
    created_at: now
  });
  return getReferralById(id);
}

async function getReferralById(id) {
  return knex('referrals').where({ id }).first();
}

async function getReferralsByUser(inviter_id) {
  return knex('referrals').where({ inviter_id }).select();
}

async function markReferralPaid(id) {
  await knex('referrals').where({ id }).update({ paid: true });
  return getReferralById(id);
}

module.exports = { createReferral, getReferralById, getReferralsByUser, markReferralPaid };
