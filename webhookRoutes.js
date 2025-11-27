const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

router.post('/mtn_momo', purchaseController.confirmPurchaseWebhook);
router.get('/test', (req, res) => res.json({ ok: true }));

module.exports = router;
