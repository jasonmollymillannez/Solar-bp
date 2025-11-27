const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/dashboard', requireAuth, requireAdmin, adminController.dashboardSummary);

module.exports = router;
