-- 002_create_products_table.sql
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price_ghc INTEGER NOT NULL CHECK (price_ghc IN (70,90,120,150,200,400)),
  daily_payout_amount NUMERIC(12,4) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);
