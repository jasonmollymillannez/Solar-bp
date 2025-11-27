/**
 * Authentication controller: register, login, refresh
 */
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');
const { signToken } = require('../config/auth');
const { BCRYPT_SALT_ROUNDS } = require('../config/auth');

async function register(req, res, next) {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      phone: Joi.string().min(8).max(20).required(),
      password: Joi.string().min(6).required(),
      full_name: Joi.string().optional(),
      referrer_code: Joi.string().optional()
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

    const existing = await userModel.getUserByEmail(value.email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const existingPhone = await userModel.getUserByPhone(value.phone);
    if (existingPhone) return res.status(400).json({ error: 'Phone already registered' });

    const password_hash = await bcrypt.hash(value.password, BCRYPT_SALT_ROUNDS);
    const id = uuidv4();

    // If referrer_code provided, try to resolve to user id (we treat it as user id in this template)
    let referrer_id = null;
    if (value.referrer_code) {
      const refUser = await userModel.getUserById(value.referrer_code).catch(() => null);
      if (refUser) referrer_id = refUser.id;
    }

    const user = await userModel.createUser({
      id,
      email: value.email,
      phone: value.phone,
      password_hash,
      full_name: value.full_name,
      referrer_id
    });

    const token = signToken({ userId: user.id, email: user.email });
    return res.json({ token, user: { id: user.id, email: user.email, phone: user.phone } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

    const user = await userModel.getUserByEmail(value.email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(value.password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = signToken({ userId: user.id, email: user.email });
    return res.json({ token, user: { id: user.id, email: user.email, phone: user.phone } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
