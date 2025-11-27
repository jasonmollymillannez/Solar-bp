#!/usr/bin/env bash
# Initialize PostgreSQL DB using DATABASE_URL env var
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL must be set in environment"
  exit 1
fi

echo "Attempting to run migrations via npm script..."
npm run migrate
echo "Migrations run"
npm run seed
echo "Seed complete"
