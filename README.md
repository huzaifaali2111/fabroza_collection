# Fabroza Collection

## Backend Setup Guide (`backend/`)

This project backend uses:
- Node.js + Express
- Prisma ORM
- PostgreSQL

### 1) Install backend dependencies

From project root:

```bash
cd backend
npm install
```

### 2) Create environment file

Create `backend/.env` with this variable:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fabroza_collection?schema=public"
```

### Required environment variables

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.

Example format:

```txt
postgresql://<DB_USER>:<DB_PASSWORD>@<HOST>:<PORT>/<DB_NAME>?schema=public
```

### 3) Setup Prisma database (migrations)

From `backend/` folder:

```bash
npx prisma migrate dev --name init
```

This command will:
- create/update your database schema
- create a migration file in `prisma/migrations`
- generate Prisma Client

If you change the Prisma schema later, run:

```bash
npx prisma migrate dev --name your_migration_name
```

### 4) (Optional) Prisma useful commands

```bash
npx prisma generate
npx prisma studio
```

- `prisma generate`: regenerate Prisma client manually.
- `prisma studio`: open Prisma GUI to view/edit data.

### 5) Run backend server

From `backend/`:

```bash
npm run dev
```

Server runs at:

```txt
http://localhost:4000
```