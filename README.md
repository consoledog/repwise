# Repwise

Repwise is a private workout tracking application for building workouts from an exercise database, tracking sets/repetitions/weights, and organizing progress through mesocycles.

## Tech Direction

- Full-stack Next.js application.
- React and TypeScript.
- PostgreSQL with Prisma.
- Auth.js for authentication.
- Vercel Blob for images.
- Vercel Hobby Free for hosting.

## Vercel Deployment

Set these environment variables in Vercel before deploying:

```text
DATABASE_URL
AUTH_SECRET
AUTH_TRUST_HOST
BLOB_READ_WRITE_TOKEN
REPWISE_SEED_USER_1_EMAIL
REPWISE_SEED_USER_1_NAME
REPWISE_SEED_USER_1_PASSWORD
REPWISE_SEED_USER_2_EMAIL
REPWISE_SEED_USER_2_NAME
REPWISE_SEED_USER_2_PASSWORD
```

`DATABASE_URL` should point to the production PostgreSQL database, for example Neon or Supabase. `AUTH_SECRET` must be a long random secret. Set `AUTH_TRUST_HOST` to `true` on Vercel. `BLOB_READ_WRITE_TOKEN` is created by Vercel Blob.

The build script runs `prisma generate` before `next build` so clean Vercel builds do not depend on package postinstall scripts.

Apply production migrations from a shell that has the production `DATABASE_URL`:

```bash
npm run prisma:deploy
```

Then create the configured private users:

```bash
npm run db:seed
```

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

## Phase 6 Upload Test

Set `BLOB_READ_WRITE_TOKEN` in `.env.local` and `.env`, then restart the dev server.

After logging in:

```text
http://localhost:3000/exercises/new
```

Expected behavior:

- Selecting a JPG, PNG, or WebP image uploads it through `/api/uploads`.
- Images larger than 4 MB are rejected.
- The image is compressed in the browser when that makes the file smaller.
- The uploaded Blob URL is saved with the exercise.
- Replacing or removing an existing exercise image attempts to delete the old managed Blob.
- Deleting an unused exercise attempts to delete its managed Blob image.

## Phase 7 Workout Test

After logging in, open `/workouts` and select `New workout`.

Expected behavior:

- Name the workout, optionally add notes, and choose Draft or Planned.
- Planned workouts require a valid scheduled date; drafts can be saved without a date.
- Search the exercise picker by name and filter by category.
- Add exercises from your own library, set their order, and enter target sets, repetitions, and weight in kilograms.
- Repetitions and weight can be left empty for cardio and mobility work.
- Optionally assign an existing mesocycle owned by the signed-in user. Mesocycle creation will be added in Phase 9.
- Save to open the workout detail page, then use `Edit` to change the plan.
- Validation failures preserve the entered values.
- Workouts and selectable exercises/mesocycles are private to each account.
- Planning edits are locked once a workout has started or contains recorded sets.
- The dashboard workout count reflects saved workouts. Live set tracking is part of Phase 8.

Workout schema, form interaction, and Server Action tests run with `npm run test:run`.
Database integration tests are opt-in and require the migrated local Docker database:

```bash
TEST_DATABASE_URL='postgresql://postgres:postgres@localhost:5432/repwise?schema=public' npm run test:run -- tests/workouts/database.test.ts
```

These tests accept only a local database URL, create isolated fixture users, and clean up their data afterward. They cover persistence, ordering, scheduling, ownership, and preservation of recorded workout sets.

## Documentation

- `PROJECT_SPECIFICATION.md`
- `SYSTEM_DESIGN.md`
- `TECH_STACK.md`
- `IMPLEMENTATION_PLAN.md`
