/**
 * Main entry for backend server
 */
require('dotenv').config();
const express = require('express');
const app = require('./app');
const { initDb } = require('./init');
const logger = require('./logging/logger');

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      logger.info(`Backend server listening on port ${PORT}`);
      console.log(`Backend server listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.stack || err.message });
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

module.exports = app;
