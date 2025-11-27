-- 004_create_transactions_table.sql
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(20) CHECK (type IN ('purchase','payout','referral_bonus','withdrawal','fee')),
  amount NUMERIC(12,2) NOT NULL,
  balance_before NUMERIC(12,2),
  balance_after NUMERIC(12,2),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
