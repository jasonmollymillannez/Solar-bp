/**
 * Referral allocation logic
 */
const { v4: uuidv4 } = require('uuid');
const referralModel = require('../models/referralModel');
const userModel = require('../models/userModel');
const transactionModel = require('../models/transactionModel');

const REFERRAL_BONUS_PERCENT = parseFloat(process.env.REFERRAL_BONUS_PERCENT || '5');

async function allocateOnPurchase(purchase) {
  if (!purchase) throw new Error('purchase required');
  const user = await userModel.getUserById(purchase.user_id);
  if (!user || !user.referrer_id) return null;
  const inviter = await userModel.getUserById(user.referrer_id);
  if (!inviter) return null;
  const bonus = (parseFloat(purchase.price_ghc) * (REFERRAL_BONUS_PERCENT / 100.0));
  const bonusRounded = parseFloat(bonus.toFixed(2));

  // create referral record
  const ref = await referralModel.createReferral({
    id: uuidv4(),
    inviter_id: inviter.id,
    invitee_id: user.id,
    purchase_id: purchase.id,
    bonus_amount: bonusRounded
  });

  // credit inviter wallet balance and log transaction
  const before = parseFloat(inviter.wallet_balance || 0.0);
  const after = parseFloat((before + bonusRounded).toFixed(2));
  await userModel.updateUser(inviter.id, { wallet_balance: after });

  await transactionModel.logTransaction({
    id: uuidv4(),
    user_id: inviter.id,
    type: 'referral_bonus',
    amount: bonusRounded,
    balance_before: before,
    balance_after: after,
    metadata: { invitee_id: user.id, purchase_id: purchase.id }
  });

  await referralModel.markReferralPaid(ref.id);

  return ref;
}

module.exports = { allocateOnPurchase };
