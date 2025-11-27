-- 005_create_referrals_table.sql
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY,
  inviter_id UUID REFERENCES users(id),
  invitee_id UUID REFERENCES users(id),
  purchase_id UUID REFERENCES purchases(id),
  bonus_amount NUMERIC(12,2),
  paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_referrals_inviter ON referrals(inviter_id);
