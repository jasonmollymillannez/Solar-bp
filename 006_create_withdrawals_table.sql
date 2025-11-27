-- 006_create_withdrawals_table.sql
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount NUMERIC(12,2),
  status VARCHAR(20) CHECK (status IN ('requested','approved','paid','rejected')) DEFAULT 'requested',
  method VARCHAR(20) CHECK (method IN ('mobile_money')) DEFAULT 'mobile_money',
  provider_reference VARCHAR(255),
  requested_at TIMESTAMP DEFAULT now(),
  processed_at TIMESTAMP,
  admin_notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
