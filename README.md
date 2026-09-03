# Repwise

Repwise is a private workout tracking application for building workouts from an exercise database, tracking sets/repetitions/weights, and organizing progress through mesocycles.

## Tech Direction

- Full-stack Next.js application.
- React and TypeScript.
- PostgreSQL with Prisma.
- Auth.js for authentication.
- Vercel Blob for images.
- Vercel Hobby Free for hosting.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run validation:

```bash
npm run type-check
npm run lint
npm run test:run
npm run build
```

## Local Database

Prisma CLI reads `.env`, while Next.js reads `.env.local`. Both files are ignored by Git and should contain the same local `DATABASE_URL`.

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Run the first migration:

```bash
npm run prisma:migrate -- --name init
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Seed local users:

```bash
npm run db:seed
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Phase 3 Database Test

After Docker Desktop is running, test the database setup with:

```bash
docker compose up -d postgres
npm run prisma:validate
npm run prisma:migrate
npm run prisma:generate
npm run prisma:status
npm run db:seed
```

Then open Prisma Studio:

```bash
npm run prisma:studio
```

Expected result:

- PostgreSQL container is healthy.
- Prisma applies the initial migration.
- Prisma Client generation succeeds.
- Seed users are created.
- Prisma Studio opens and shows the Repwise tables.

Default local users are created only when seed env vars are not set and `NODE_ENV` is not `production`:

```text
owner@example.com / password123
partner@example.com / password123
```

Use `REPWISE_SEED_USER_*` values in `.env` for real local credentials.

## Phase 4 Auth Test

After the database migration and seed are applied, start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Expected behavior:

- `/` redirects to `/login` when signed out.
- `/dashboard` redirects to `/login` when signed out.
- Login with `owner@example.com / password123` works if default local seed users were created.
- After login, the app redirects to `/dashboard`.
- The header logout button signs the user out and returns to `/login`.
- `/register` shows that public registration is closed.

## Phase 5 Exercise Test

After logging in, open:

```text
http://localhost:3000/exercises
```

Expected behavior:

- The exercise list is scoped to the signed-in user.
- `New exercise` opens the create form.
- Creating an exercise redirects to its detail page.
- The library page supports search and category filtering.
- The detail page shows category, source, description, optional image, and usage count.
- `Edit` updates the exercise and returns to the detail page.
- `Delete` asks for confirmation and removes unused exercises.

## Documentation

- `PROJECT_SPECIFICATION.md`
- `SYSTEM_DESIGN.md`
- `TECH_STACK.md`
- `IMPLEMENTATION_PLAN.md`
