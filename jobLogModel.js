const knex = require('../config/db');

async function logJob({ id, name, status, details, run_at }) {
  const now = run_at || new Date();
  await knex('job_logs').insert({
    id,
    name,
    status,
    details: details || null,
    run_at: now
  });
}

async function getRecentJobLogs(name, limit = 20) {
  return knex('job_logs').where({ name }).orderBy('run_at', 'desc').limit(limit).select();
}

module.exports = { logJob, getRecentJobLogs };
