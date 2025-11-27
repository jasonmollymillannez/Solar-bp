/**
 * Simple migration runner: executes SQL files in backend/migrations
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const knex = require('./config/db');

async function run() {
  try {
    const migDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migDir).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
      const full = path.join(migDir, file);
      const sql = fs.readFileSync(full, 'utf8');
      if (!sql.trim()) continue;
      console.log('Running', file);
      await knex.raw(sql);
    }
    console.log('Migrations completed');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
}

run();
