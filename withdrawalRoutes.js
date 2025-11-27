const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

router.post('/request', requireAuth, withdrawalController.requestWithdrawal);
router.get('/', requireAuth, withdrawalController.listUserWithdrawals);

// Admin routes
router.post('/:id/approve', requireAuth, requireAdmin, withdrawalController.approveWithdrawal);
router.post('/:id/reject', requireAuth, requireAdmin, withdrawalController.rejectWithdrawal);

module.exports = router;
