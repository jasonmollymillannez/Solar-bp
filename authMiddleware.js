/**
 * JWT-based auth middleware
 */
const { verifyToken } = require('../config/auth');
const userModel = require('../models/userModel');

async function requireAuth(req, res, next) {
  try {
    const header = req.get('Authorization') || req.get('authorization');
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }
    const token = header.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload || !payload.userId) return res.status(401).json({ error: 'Invalid token' });
    const user = await userModel.getUserById(payload.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: ' + (err.message || '') });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
