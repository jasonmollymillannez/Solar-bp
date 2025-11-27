/**
 * Knex instance configuration using DATABASE_URL
 */
const knexLib = require('knex');
const { parse } = require('pg-connection-string');

const connectionUrl = process.env.DATABASE_URL || 'postgres://bp_user:password@localhost:5432/blockplanner';
const parsed = parse(connectionUrl);

const knex = knexLib({
  client: 'pg',
  connection: {
    host: parsed.host,
    port: parsed.port,
    user: parsed.user,
    password: parsed.password,
    database: parsed.database,
    ssl: false
  },
  pool: { min: 0, max: 10 }
});

async function runMigrations() {
  // No knex migrations in this simplified implementation; migrations are raw SQL files run at init
  return;
}

module.exports = knex;
