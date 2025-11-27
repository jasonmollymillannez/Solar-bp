const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

// Admin-only create
router.post('/', requireAuth, requireAdmin, productController.createProduct);

module.exports = router;
