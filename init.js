/**
 * DB & migrations initializer
 */
const knex = require('./config/db');
const logger = require('./logging/logger');

async function initDb() {
  try {
    // Run migrations if necessary
    // We will run SQL files in backend/migrations/*.sql
    const fs = require('fs');
    const path = require('path');
    const migDir = path.join(__dirname, '..', 'migrations');
    if (fs.existsSync(migDir)) {
      const files = fs.readdirSync(migDir).filter(f => f.endsWith('.sql')).sort();
      for (const file of files) {
        const full = path.join(migDir, file);
        const sql = fs.readFileSync(full, 'utf8');
        if (!sql.trim()) continue;
        await knex.raw(sql);
      }
      logger.info('Migrations executed from SQL files');
    }
  } catch (err) {
    logger.warn('Migrations step failed or already applied', { error: err.message });
  }
}

module.exports = { initDb };
