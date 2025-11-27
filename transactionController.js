/**
 * Transaction endpoints
 */
const transactionModel = require('../models/transactionModel');

async function listTransactions(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, parseInt(req.query.limit || '50', 10));
    const offset = (page - 1) * limit;
    const type = req.query.type;
    let items;
    if (req.user.is_admin && req.query.user_id) {
      items = await transactionModel.getTransactionsByUser(req.query.user_id, limit, offset);
    } else {
      items = await transactionModel.getTransactionsByUser(req.user.id, limit, offset);
    }
    res.json({ transactions: items });
  } catch (err) {
    next(err);
  }
}

async function getTransaction(req, res, next) {
  try {
    const t = await transactionModel.getTransactionById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Not found' });
    if (t.user_id !== req.user.id && !req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });
    res.json({ transaction: t });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTransactions, getTransaction };
