# Omkar Healthcare Backend Testing & Database Guide

## 1. Running the Test PostgreSQL Database

The test suite runs against a real PostgreSQL 16 instance configured by default on port `5433` with database `aarogyamed_test_db` (see `backend/config/db/config.js`).

### Option A: Using Docker Compose (Recommended)

The test database service is declared in `backend/docker-compose.yml` under `test-database`:

```bash
# Start test database container in background
docker compose -f backend/docker-compose.yml up -d test-database
```

To stop it when testing is finished:
```bash
docker compose -f backend/docker-compose.yml stop test-database
```

### Option B: Using Manual Docker Command

If you prefer to start a standalone throwaway container directly with `docker run`:

```bash
docker run -d \
  --name aarogyamed-test-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=aarogyamed_test_db \
  -p 5433:5432 \
  postgres:16-alpine
```

---

## 2. Running Backend Tests

With the PostgreSQL test container running on port 5433:

```bash
cd backend
DB_PORT=5433 npm test -- tests/payment-idempotency.test.js
```

This runs the comprehensive 17-test suite verifying payment idempotency, server-side amount enforcement, attempt caps, webhook re-validation, durable audit logs, failed state reconciliation, and order deduplication against real PostgreSQL.
