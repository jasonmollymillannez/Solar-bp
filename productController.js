/**
 * Product handlers
 */
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const productModel = require('../models/productModel');
const { calculateDailyPayout } = require('../utils/incomeCalculator');

const ALLOWED_PRICES = [70, 90, 120, 150, 200, 400];

async function listProducts(req, res, next) {
  try {
    const products = await productModel.listProducts();
    res.json({ products });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      price_ghc: Joi.number().valid(...ALLOWED_PRICES).required(),
      description: Joi.string().allow('', null)
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

    const { daily_payout } = calculateDailyPayout(value.price_ghc, 18);
    const product = await productModel.createProduct({
      id: uuidv4(),
      name: value.name,
      price_ghc: value.price_ghc,
      daily_payout_amount: parseFloat(daily_payout.toFixed(4)),
      description: value.description
    });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProducts, getProduct, createProduct };
