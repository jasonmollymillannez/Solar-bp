-- 007_create_job_logs_table.sql
CREATE TABLE IF NOT EXISTS job_logs (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(10) CHECK(status IN ('started','success','failed')),
  details JSONB,
  run_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_job_logs_name ON job_logs(name);
