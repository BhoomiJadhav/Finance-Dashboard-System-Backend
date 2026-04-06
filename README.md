# Finance Dashboard System (Backend)

A production-style backend for a Finance Dashboard using Node.js, Express, and MongoDB with JWT auth, RBAC, transaction management, dashboard analytics, validation, and centralized error handling.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Validation (`express-validator`)
- Security & ops (`helmet`, `cors`, `morgan`, `express-rate-limit`)

## Folder Structure

```txt
/src
  /models
  /controllers
  /routes
  /middleware
  /services
  /utils
  /config
server.js
```

## Setup Instructions

1. Clone and open this project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example`.
4. Ensure MongoDB is running locally (or provide remote URI).
5. Start server:
   ```bash
   npm run dev
   ```

Base URL: `http://localhost:5000/api`

## Role Access (RBAC)

- Viewer
  - Can read transactions only.
  - Cannot create/update/delete transactions.
  - Cannot access dashboard summary.
- Analyst
  - Can read transactions.
  - Can access dashboard summary.
  - Cannot create/update/delete transactions.
- Admin
  - Full CRUD access on transactions.
  - Can access dashboard summary.

## Authentication

### Register

`POST /auth/register`

Request body:

```json
{
  "name": "Aarav",
  "email": "aarav@example.com",
  "password": "secret123",
  "role": "Admin"
}
```

Sample response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "<JWT_TOKEN>",
    "user": {
      "id": "6612f2d4f6d8fa07f0d4abcd",
      "name": "Aarav",
      "email": "aarav@example.com",
      "role": "Admin",
      "status": "active"
    }
  }
}
```

### Login

`POST /auth/login`

Request body:

```json
{
  "email": "aarav@example.com",
  "password": "secret123"
}
```

## Transactions API

Use header: `Authorization: Bearer <JWT_TOKEN>`

### Create Transaction (Admin only)

`POST /transactions`

```json
{
  "amount": 1500,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01",
  "note": "Monthly salary"
}
```

### Get Transactions (All roles)

`GET /transactions`

Query params:

- `type` = `income|expense`
- `category` = string
- `dateFrom` = ISO date
- `dateTo` = ISO date
- `amountMin` = minimum amount (>= 0)
- `amountMax` = maximum amount (>= 0)
- `search` = keyword (searches note/category)
- `sortBy` = `date|amount|createdAt` (default `date`)
- `sortOrder` = `asc|desc` (default `desc`)
- `page` = number (default: 1)
- `limit` = number (default: 10, max: 100)

Sample response:

```json
{
  "success": true,
  "message": "Transactions fetched successfully",
  "data": [
    {
      "_id": "6612f4f2f6d8fa07f0d4a111",
      "amount": 1500,
      "type": "income",
      "category": "Salary",
      "date": "2026-04-01T00:00:00.000Z",
      "note": "Monthly salary",
      "createdBy": "6612f2d4f6d8fa07f0d4abcd",
      "isDeleted": false
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Update Transaction (Admin only)

`PUT /transactions/:id`

### Delete Transaction (Admin only, Soft Delete)

`DELETE /transactions/:id`

## Dashboard Summary API

### Get Summary (Admin, Analyst)

`GET /dashboard/summary`

Returns:

- Total income
- Total expense
- Net balance
- Category-wise totals
- Recent transactions (last 5)
- Monthly trends grouped by month and type

Sample response:

```json
{
  "success": true,
  "message": "Dashboard summary fetched successfully",
  "data": {
    "totalIncome": 5500,
    "totalExpense": 1800,
    "netBalance": 3700,
    "categoryWiseTotals": [
      { "category": "Salary", "total": 5000 },
      { "category": "Food", "total": 800 }
    ],
    "recentTransactions": [],
    "monthlyTrends": [
      { "year": 2026, "month": 3, "type": "income", "total": 5000 },
      { "year": 2026, "month": 3, "type": "expense", "total": 1200 }
    ]
  }
}
```

## Validation and Error Handling

- Request validation is enforced with `express-validator`.
- Additional query validation includes:
  - `dateFrom <= dateTo`
  - `amountMin <= amountMax`
  - `sortBy` and `sortOrder` allow-list checks
- Centralized error middleware handles:
  - Validation errors (`400`)
  - Unauthorized (`401`)
  - Forbidden (`403`)
  - Not found (`404`)
  - Duplicate conflicts (`409`)
  - Generic server errors (`500`)

Validation error format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be > 0"
    }
  ]
}
```

## Optional Enhancements Included

- Pagination for transaction listing
- Keyword search on transactions
- Soft delete for transactions
- Global and auth-specific rate limiting

## Assumptions

- Each user reads and manages their own transactions only.
- Admin has CRUD only on their own records in this implementation.
- Dashboard summary is user-scoped.
- Role is assigned at registration for simplicity (can be changed to admin-managed flow in future).

## Health Check

`GET /health`

Response:

```json
{
  "success": true,
  "message": "Finance API is healthy"
}
```

## Postman Documentation (Shareable)

Use the ready files in `postman/`:

- `postman/Finance-Dashboard-System.postman_collection.json`
- `postman/Finance-Dashboard-Local.postman_environment.json`

### Import in Postman

1. Open Postman.
2. Click **Import**.
3. Import both files above.
4. Select environment **Finance Dashboard Local**.
5. Start server (`npm run dev`) and run requests.

### Recommended run order

1. `Health / Health Check`
2. `Auth / Register Admin`, `Register Analyst`, `Register Viewer`
3. `Auth / Login ...` requests (these auto-save tokens)
4. `Transactions (Admin Token)` folder
5. `Dashboard` and `RBAC Negative Checks`

### Share with senior

- Option 1: Share these two JSON files directly.
- Option 2: Import collection in Postman and use **Share** to generate a workspace/collection link.
- Option 3: Run the collection via Collection Runner and export run results as proof.

### Postman tests included

The collection includes quick assertions for:

- Successful login (`200`) and auto-save token variables.
- Transaction create success (`201`) and auto-save `transactionId`.
- Filter endpoint returns success (`200`) with `meta` object.
- Validation failure checks (`400`) for invalid `amount`, invalid date range, and invalid amount range.
- Unauthorized check (`401`) when token is missing.
