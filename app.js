/**
 * Express application configuration
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const logger = require('./logging/logger');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();

app.use(helmet());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.CSRF_SECRET || 'csrf_secret_placeholder'));

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
});
app.use(limiter);

// CSRF (applied to unsafe verbs)
const csrfMiddleware = csurf({
  cookie: {
    httpOnly: true,
    sameSite: 'lax'
  }
});
app.use((req, res, next) => {
  // ignore for API provider webhooks
  if (req.path.startsWith('/api/v1/purchases/webhook') || req.path.startsWith('/api/v1/webhooks/')) {
    return next();
  }
  return csrfMiddleware(req, res, next);
});

// Expose a simple health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/purchases', purchaseRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/withdrawals', withdrawalRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/webhooks', webhookRoutes);

// Central error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.stack || err.message });
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
