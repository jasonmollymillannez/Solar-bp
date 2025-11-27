API Documentation (summary)

- POST /api/v1/auth/register
  - body: { email, phone, password, full_name?, referrer_code? }
  - response: { token, user }

- POST /api/v1/auth/login
  - body: { email, password }
  - response: { token, user }

- GET /api/v1/products
  - response: { products: [...] }

- POST /api/v1/purchases/initiate (auth)
  - body: { product_id }
  - response: { purchase_id, payment_url, provider_reference }

- POST /api/v1/purchases/webhook/momo
  - public webhook for provider callbacks

- POST /api/v1/withdrawals/request (auth)
  - body: { amount, mobile_number }

- Admin endpoints require Authorization Bearer token of admin user
