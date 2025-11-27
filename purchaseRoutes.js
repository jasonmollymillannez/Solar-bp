const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/initiate', requireAuth, purchaseController.initiatePurchase);
// Webhook endpoint for MoMo provider callbacks (public)
router.post('/webhook/momo', purchaseController.confirmPurchaseWebhook);
router.get('/', requireAuth, purchaseController.listUserPurchases);
router.get('/:id', requireAuth, purchaseController.getPurchase);

module.exports = router;
