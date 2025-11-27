-- 008_create_tokens_table.sql
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
