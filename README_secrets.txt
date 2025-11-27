Store Mobile Money certificates and private keys securely. Recommended:
- Docker secrets (create using docker secret create ...)
- Or environment variables on your VPS host

Expected paths (if using Docker secrets):
/run/secrets/mtn_momo_key
/run/secrets/mtn_momo_cert
