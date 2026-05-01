# Unified Automotive Operating System

Production-ready modular SaaS MVP for commercial vehicle dealerships.

## Architecture
- `backend/`: Node.js + Express REST API, PostgreSQL (Prisma), JWT auth, RBAC, branch data segmentation.
- `frontend/`: Next.js + React + Tailwind mobile-first dashboard and workflows.

## Modules implemented
1. Authentication & Users
2. CRM (customers, leads, interactions via entity relation)
3. Vehicle sales (vehicles, quotations, sales)
4. Workshop/job cards with part consumption and status
5. Spare parts inventory + stock deduction
6. Billing/invoices with multi-currency and payment status
7. Accounting ledger entries
8. Dashboard analytics
9. Multi-branch support
10. Settings/configuration
11. Offline-first basic job-card queue (localStorage sync when online)

## Backend setup
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Default login:
- `admin@uos.com`
- `admin123`

## Frontend setup
```bash
cd frontend
npm install
export NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm run dev
```

## API testing
Use Postman with bearer JWT token from `/api/auth/login`.

Key endpoints:
- `POST /api/auth/login`
- `GET/POST /api/customers`
- `GET/POST /api/vehicles`
- `GET/POST /api/workshop`
- `POST /api/workshop/:id/parts`
- `PATCH /api/workshop/:id/status`
- `GET /api/dashboard`
- `GET/POST /api/invoices`
- `GET/POST /api/ledger`

## Docker (optional)
Create containers for:
- `postgres:16`
- backend service
- frontend service

(Compose template can be added next iteration.)
