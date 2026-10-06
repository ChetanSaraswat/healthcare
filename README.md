# AarogyaMed Medical Equipment Platform (Buy & Rent)

This repository contains the full-stack codebase for the AarogyaMed platform, structured into **3 completely independent applications/services**:

```text
healthcare/
├── backend/                  # Node.js + Express.js + Sequelize REST API
│   ├── Dockerfile            # Production multi-stage Dockerfile
│   ├── Dockerfile.dev        # Development Dockerfile
│   ├── docker-compose.yml    # Backend Docker Compose (API + PostgreSQL + Mailpit + pgAdmin)
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── index.js
│   ├── controllers/
│   ├── services/
│   ├── repository/
│   └── models/
│
├── public-frontend/          # Next.js 15 Customer Storefront (Port 3000)
│   ├── Dockerfile            # Standalone Next.js 15 production runner
│   ├── Dockerfile.dev        # Development Dockerfile
│   ├── docker-compose.yml    # Public Frontend Docker Compose
│   ├── .env
│   ├── .env.example
│   ├── package.json          # Independent dependencies
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── public/
│   ├── tests/
│   └── src/
│
└── admin-frontend/           # Next.js 15 Admin Operations Console (Port 3001)
    ├── Dockerfile            # Standalone Next.js 15 production runner
    ├── Dockerfile.dev        # Development Dockerfile
    ├── docker-compose.yml    # Admin Frontend Docker Compose
    ├── .env
    ├── .env.example
    ├── package.json          # Independent dependencies
    ├── next.config.mjs
    ├── tsconfig.json
    ├── public/
    └── src/
```

There is **no root orchestrator**. Following the Residency application model, each project is self-contained and managed directly from within its own directory (`cd <app> && docker compose up`). All applications communicate over the shared external Docker bridge network (`aarogyamed-shared-network`).

---

## Port Allocation Reference

| Application | Directory | Service Name | Container Name | Host Port | Internal Port | URL / Access |
|---|---|---|---|---|---|---|
| **Backend REST API** | `backend/` | `backend` | `aarogyamed-backend` | **`8080`** | `8080` | [http://localhost:8080](http://localhost:8080) |
| **API Docs (Swagger)** | `backend/` | `backend` | `aarogyamed-backend` | **`8080`** | `8080` | [http://localhost:8080/api/docs](http://localhost:8080/api/docs) |
| **PostgreSQL Database**| `backend/` | `database` | `aarogyamed-database` | **`5434`** | `5432` | `localhost:5434` (DB: `aarogyamed_db`) |
| **Mailpit Web UI** | `backend/` | `mailpit` | `aarogyamed-mailpit` | **`8026`** | `8025` | [http://localhost:8026](http://localhost:8026) |
| **Mailpit SMTP** | `backend/` | `mailpit` | `aarogyamed-mailpit` | **`1026`** | `1025` | `localhost:1026` |
| **pgAdmin 4** | `backend/` | `pgadmin` | `aarogyamed-pgadmin` | **`8888`** | `80` | [http://localhost:8888](http://localhost:8888) |
| **Public Frontend** | `public-frontend/` | `public-frontend` | `aarogyamed-public-frontend` | **`3000`** | `3000` | [http://localhost:3000](http://localhost:3000) |
| **Admin Frontend** | `admin-frontend/` | `admin-frontend` | `aarogyamed-admin-frontend` | **`3001`** | `3001` | [http://localhost:3001](http://localhost:3001) |

---

## One-Time Setup (Clean Checkout)

### 1. Create the Shared Network
Like the Residency application, create the external shared Docker bridge network once:
```bash
docker network create aarogyamed-shared-network || true
```

### 2. Environment Files Setup
```bash
# 1. Backend
cp backend/.env.example backend/.env

# 2. Public Frontend
cp public-frontend/.env.example public-frontend/.env

# 3. Admin Frontend
cp admin-frontend/.env.example admin-frontend/.env
```

---

## Running Applications (Folder-by-Folder)

### 1. Backend (`cd backend`)

```bash
cd backend

# Build images
docker compose build

# Start backend, database, mailpit, and pgadmin
docker compose up -d

# First-time database setup: Run migrations and seed catalog medical equipment
docker compose exec backend npm run up
docker compose exec backend npm run seed:products

# View logs
docker compose logs -f backend

# Enter backend container
docker compose exec backend sh

# Stop backend
docker compose down
```

---

### 2. Public Frontend (`cd public-frontend`)

```bash
cd public-frontend

# Build image
docker compose build

# Start public storefront
docker compose up -d

# View logs
docker compose logs -f public-frontend

# Enter container shell
docker compose exec public-frontend sh

# Stop public frontend
docker compose down
```

---

### 3. Admin Frontend (`cd admin-frontend`)

```bash
cd admin-frontend

# Build image
docker compose build

# Start admin console
docker compose up -d

# View logs
docker compose logs -f admin-frontend

# Enter container shell
docker compose exec admin-frontend sh

# Stop admin frontend
docker compose down
```

---

## Running Applications Manually Inside Containers

If you wish to run development servers interactively from within each container shell:

### Backend:
```bash
cd backend
docker compose exec backend sh
npm run dev             # Start Express API with nodemon
npm run up              # Run migrations
npm run seed:products   # Seed catalog equipment
exit
```

### Public Frontend:
```bash
cd public-frontend
docker compose exec public-frontend sh
npm run dev             # Start Next.js storefront on port 3000
npm test                # Run checkout session tests
exit
```

### Admin Frontend:
```bash
cd admin-frontend
docker compose exec admin-frontend sh
npm run dev             # Start Next.js admin console on port 3001
exit
```
