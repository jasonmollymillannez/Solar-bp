-- 003_create_purchases_table.sql
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  price_ghc INTEGER NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending','active','completed','cancelled')) DEFAULT 'pending',
  recovered_amount NUMERIC(12,2) DEFAULT 0.00,
  started_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
