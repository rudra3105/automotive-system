# Unified Automotive Operating System

Production-grade SaaS MVP for commercial vehicle dealerships (trucks, buses, construction equipment).

## What was improved
- Fixed dashboard aggregation bugs and improved KPI query reliability.
- Added secure `GET /api/auth/me` protection.
- Added full workshop financial flow: **job card -> parts deduction -> invoice generation -> payment update -> ledger posting**.
- Added billing payment API and UI action for partial/full settlements.
- Improved workshop UI with one-click invoice generation.
- Kept unified data model with consistent branch-aware records.

## 1) Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL (or Supabase Postgres)

## 2) Clone and install
```bash
git clone <your-repo-url>
cd automotive-system

cd backend
npm install

cd ../frontend
npm install
```

## 3) Configure environment
Create `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uos"
JWT_SECRET="replace-with-long-random-secret"
PORT=4000
```

If using **Supabase**, copy the project connection string from Supabase dashboard and paste it as `DATABASE_URL`.

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 4) Database migration + seed
From `backend/`:
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

Default seeded login:
- Email: `admin@uos.com`
- Password: `admin123`

## 5) Run the system
Terminal 1 (backend):
```bash
cd backend
npm run dev
```

Terminal 2 (frontend):
```bash
cd frontend
npm run dev
```

Open: `http://localhost:3000`

## 6) API endpoints (core)
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|POST /api/customers`
- `GET|POST /api/workshop`
- `POST /api/workshop/:id/parts`
- `POST /api/workshop/:id/generate-invoice`
- `PATCH /api/invoices/:id/payment`
- `GET /api/dashboard`

## 7) Beginner test flow (end-to-end)
1. Login with seeded admin account.
2. Create a customer using `POST /api/customers` (or existing seeded customer).
3. Create a job card in Workshop page.
4. Add parts with API: `POST /api/workshop/:id/parts`.
5. Click **Generate Invoice** on the workshop row.
6. Go to Billing page and record payment using invoice ID.
7. Open Dashboard page and verify revenue/outstanding metrics update.

## 8) Postman quick guide
1. Call `POST /api/auth/login`.
2. Copy `token` from response.
3. Set Bearer token in Authorization for next calls.
4. Test job card -> parts -> invoice -> payment flow.
