# Saree Tassels — Fashion SaaS Platform

Multi-tenant SaaS platform enabling saree boutiques and weavers to digitise inventory,
manage tassel/design variants, process B2C orders, and track fulfilment — built on MERN stack.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React Router v6, Axios, Recharts |
| Backend | Node.js 20, Express.js 4 |
| Database | MongoDB 7, Mongoose 8 |
| Auth | JWT (access + refresh), bcrypt |
| Payments | Razorpay (HMAC-SHA256 webhook verification) |
| Media | Cloudinary CDN |
| Email | Nodemailer |
| Testing | Jest, Supertest |
| CI/CD | GitHub Actions |
| Deploy | Render / Railway |

## Project Structure

```
saree-tassels/
├── client/          # React SPA
├── server/          # Express REST API
├── tests/           # Jest + Supertest integration tests
└── .github/         # CI/CD workflows
```

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB 7+ (or MongoDB Atlas URI)
- Cloudinary account
- Razorpay test account

### Setup

```bash
# Clone
git clone https://github.com/your-username/saree-tassels.git
cd saree-tassels

# Server dependencies
npm install

# Client dependencies
cd client && npm install && cd ..

# Environment
cp .env.example .env
# Fill in your values in .env

# Run (dev — runs server + client concurrently)
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server + client concurrently |
| `npm run server` | Start server only (nodemon) |
| `npm run client` | Start React dev server only |
| `npm test` | Run Jest integration tests |
| `npm run build` | Build React client for production |

## API Endpoints

### Auth
- `POST /api/auth/register` — Tenant + owner registration
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Products
- `GET /api/products` — Paginated product listing
- `GET /api/products/:id`
- `POST /api/products` — TenantAdmin
- `PUT /api/products/:id` — TenantAdmin
- `DELETE /api/products/:id` — TenantAdmin (soft delete)
- `POST /api/products/:id/images`

### Orders
- `POST /api/orders` — Place order
- `GET /api/orders` — Tenant orders (TenantAdmin)
- `GET /api/orders/my` — Customer's own orders
- `GET /api/orders/:id`
- `PUT /api/orders/:id/status`
- `POST /api/orders/:id/cancel`

### Payments
- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `POST /api/payments/webhook`

### Tenant / Analytics
- `GET /api/tenant/profile`
- `PUT /api/tenant/profile`
- `GET /api/analytics/dashboard`

### Platform Admin
- `GET /api/admin/tenants`
- `PUT /api/admin/tenants/:id/status`

## Security Notes
- JWT access token TTL: 15 min
- Refresh token: 7 days, HTTP-only cookie
- Passwords: bcrypt salt rounds ≥ 12
- Payment webhooks: HMAC-SHA256 signature verified
- Tenant data isolation: mandatory `tenantId` filter on every DB query
- Secrets: never committed — use `.env`

## Known Gaps (Backlog)
- [ ] Redis caching for product listings
- [ ] MongoDB Atlas replica set
- [ ] helmet.js security headers
- [ ] API versioning (`/api/v1/`)
- [ ] WebSocket order tracking
- [ ] Load test with k6/Artillery
- [ ] Refresh token rotation
- [ ] Field-level encryption for PII

## License
MIT
