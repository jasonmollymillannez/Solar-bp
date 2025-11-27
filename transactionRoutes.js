const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', requireAuth, transactionController.listTransactions);
router.get('/:id', requireAuth, transactionController.getTransaction);

module.exports = router;
