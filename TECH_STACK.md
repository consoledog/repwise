# Repwise Tech Stack

## Overview

This document defines the proposed technology stack for Repwise across frontend, backend, database, storage, DevOps, and CI/CD.

The current decision is to build Repwise as a full-stack Next.js application hosted on Vercel Hobby Free. This removes the separate Spring Boot backend and VM hosting requirement.

The existing `react_bootstrap` project should still be used as a reference for React conventions, component style, validation patterns, state management ideas, testing setup, and code quality workflow. It should not be copied directly as-is because it is a Vite single-page app, while Repwise will now use Next.js App Router.

## Stack Summary

| Area | Recommended Choice |
| --- | --- |
| Application Framework | Next.js 16.x |
| UI Library | React |
| Language | TypeScript |
| Routing | Next.js App Router |
| Styling | Tailwind CSS |
| Forms | React Hook Form |
| Validation | Zod |
| Client State | Zustand for UI and workout drafts |
| Server State | Server Components and Server Actions first, TanStack Query only where useful |
| Database | PostgreSQL |
| Database Provider | Neon Postgres Free, preferably connected through Vercel Marketplace |
| ORM | Prisma |
| Migrations | Prisma Migrate |
| Authentication | Auth.js credentials provider |
| Password Hashing | bcrypt or Argon2 |
| File Storage | Vercel Blob |
| Hosting | Vercel Hobby Free |
| CI/CD | Vercel Git integration plus GitHub Actions for validation |
| Testing | Vitest, React Testing Library, MSW, Playwright later if needed |

## Frontend Stack

### Framework

Use Next.js with the App Router.

Recommended frontend technologies:

- React.
- TypeScript.
- Tailwind CSS.
- React Hook Form.
- Zod.
- Zustand.
- Lucide icons.
- Radix UI or shadcn/ui primitives when needed.

The UI should be mobile-first because the app will mostly be used from a phone during workouts.

### React Bootstrap Project Usage

The `react_bootstrap` project provides a useful starting reference:

- Feature-based folder organization.
- TypeScript conventions.
- Form handling with React Hook Form and Zod.
- Client state with Zustand.
- API and auth flow concepts.
- Tailwind/global CSS setup.
- Testing and linting workflow.

Parts that should change for Next.js:

- Replace React Router with App Router routes.
- Replace Vite with Next.js build/runtime.
- Replace `VITE_` environment variables with `NEXT_PUBLIC_` only for public values.
- Reduce Axios usage for internal data because Server Actions and server-side data access can call the database directly.
- Keep Axios only for external APIs if needed.

### Recommended App Structure

```text
repwise/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── exercises/
│   │   ├── workouts/
│   │   ├── mesocycles/
│   │   └── progress/
│   ├── api/
│   │   ├── auth/
│   │   └── uploads/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
├── features/
│   ├── auth/
│   ├── exercises/
│   ├── workouts/
│   ├── mesocycles/
│   └── progress-photos/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── storage/
│   └── validation/
├── prisma/
│   └── schema.prisma
├── public/
└── tests/
```

### State Strategy

Use server-side data access by default:

- Fetch user-owned exercises on the server.
- Fetch workout history on the server.
- Fetch mesocycle data on the server.
- Mutate data through Server Actions.

Use Zustand for local interaction state:

- Active workout draft.
- Unsaved set input while training.
- Modal and UI state.
- Temporary filters and tabs.

Use TanStack Query only when the UI needs rich client-side cache behavior, polling, optimistic updates, or repeated client-side refetching.

## Backend Stack

### Backend Model

There is no separate backend service.

Backend logic lives inside the Next.js application:

- Server Actions for normal form/mutation flows.
- Route Handlers for upload endpoints and API-style endpoints.
- Server-only modules for database access.
- Auth.js route handlers for authentication.

This is enough for the MVP because the app has a small user base and straightforward CRUD-heavy behavior.

### Backend Code Organization

Recommended internal structure:

```text
features/exercises/
├── actions.ts
├── queries.ts
├── schemas.ts
├── types.ts
└── components/
```

Recommended responsibilities:

- `actions.ts`: Server Actions that validate input and write data.
- `queries.ts`: server-only read queries.
- `schemas.ts`: Zod schemas.
- `types.ts`: feature types.
- `components/`: feature UI.

Shared backend utilities should live under:

```text
lib/
├── auth/
├── db/
├── storage/
└── security/
```

## Database Stack

### Database Provider

Recommended provider:

- Neon Postgres Free.

Reasoning:

- It works well with serverless Vercel deployments.
- It can be connected through Vercel Marketplace.
- It currently has a free plan suitable for a two-user personal app.
- It avoids running PostgreSQL on a VM.

Alternative:

- Supabase PostgreSQL Free plan if Supabase features are preferred.

### ORM

Recommended ORM:

- Prisma.

Recommended packages:

- `prisma`
- `@prisma/client`

Use Prisma for:

- Schema definition.
- Type-safe queries.
- Migrations.
- Local development database sync.

### Local Database

Use Docker Compose for local PostgreSQL.

Recommended local services:

- PostgreSQL.
- Optional Adminer or pgAdmin.

Production database should remain managed through Neon.

## Authentication Stack

### Auth Provider

Recommended authentication:

- Auth.js credentials provider.

Recommended user model:

- Closed registration for MVP.
- Manually create the two allowed users through a seed script or admin-only route.
- Store hashed passwords in PostgreSQL.

Reasoning:

- The app is private.
- There are only two expected users.
- This keeps authentication inside the Next.js app.
- It avoids an extra hosted auth provider.

### Auth Security

Rules:

- Use HTTP-only secure cookies.
- Hash passwords with bcrypt or Argon2.
- Validate login input with Zod.
- Rate limit login attempts if public access is enabled.
- Keep public registration disabled unless invite-only registration is implemented.
- Enforce user ownership on every query and mutation.

## File Storage Stack

### Storage Provider

Recommended provider:

- Vercel Blob.

Use it for:

- Exercise images.
- Mesocycle before photos.
- Mesocycle after photos.

Rules:

- Store file metadata in PostgreSQL.
- Store actual files in Vercel Blob.
- Compress images before upload.
- Enforce file size and type limits.
- Avoid storing images in the Git repository or database.

Fallback if storage grows:

- Cloudflare R2.

## DevOps Stack

### Hosting

Recommended hosting:

- Vercel Hobby Free.

Vercel should host:

- Next.js frontend.
- Server Components.
- Server Actions.
- Route Handlers.
- Auth.js routes.
- Preview deployments.
- Production deployment.
- Environment variables.
- Vercel Blob.

Vercel should not be treated as the database provider. For PostgreSQL, use Neon or Supabase.

### Environment Variables

Recommended environment variables:

```text
DATABASE_URL=
AUTH_SECRET=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_APP_NAME=Repwise
```

Optional:

```text
NEXT_PUBLIC_APP_URL=
INVITE_CODE=
```

Only expose variables with `NEXT_PUBLIC_` when they are safe to send to the browser.

### Local Development

Recommended local setup:

- `npm run dev` for Next.js.
- Docker Compose for PostgreSQL.
- Vercel CLI only when testing Vercel-specific behavior locally.
- `.env.local` for local secrets.
- `.env.example` committed as documentation.

Recommended local commands:

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run test
npx prisma migrate dev
```

## CI/CD Stack

### CI Provider

Recommended CI:

- Vercel Git integration for deployments.
- GitHub Actions for validation.

### Validation Pipeline

Run on pull requests:

```bash
npm ci
npm run type-check
npm run lint
npm run test:run
npm run build
```

Recommended future checks:

- Prisma schema validation.
- Migration validation.
- Playwright smoke tests.
- Bundle size check.

### Deployment Flow

Recommended flow:

1. Push feature branch.
2. Vercel creates preview deployment.
3. GitHub Actions runs validation.
4. Merge to `main`.
5. Vercel deploys production.

This is simpler than managing a VM and separate backend deployment.

## Free Tier Notes

The intended free setup is:

```text
Application hosting -> Vercel Hobby Free
Database -> Neon Postgres Free
Authentication -> Auth.js inside Next.js
Image storage -> Vercel Blob included Hobby usage
```

Expected fit for two users:

- Application usage should fit Vercel Hobby.
- Database usage should fit Neon Free.
- Image storage should fit Vercel Blob if photos are compressed and not excessive.

Risks:

- Free tiers can change.
- Free limits can be exceeded.
- Vercel Hobby can pause when usage limits are exceeded.
- Vercel Blob can become unavailable until the billing window resets if Blob limits are exceeded.

## Initial Implementation Order

Recommended implementation order:

1. Scaffold a Next.js app in the `repwise` repository.
2. Port useful UI/convention ideas from `react_bootstrap`.
3. Configure Tailwind CSS, ESLint, Prettier, Vitest, and TypeScript.
4. Add Prisma and Neon PostgreSQL.
5. Define the initial Prisma schema.
6. Add Auth.js credentials login.
7. Add closed registration or seed the two initial users.
8. Implement exercise CRUD.
9. Implement workout creation and active workout tracking.
10. Implement mesocycle management.
11. Implement Vercel Blob uploads for progress photos.
12. Deploy to Vercel Hobby Free.

## Final Recommendation

Use a full-stack Next.js application hosted on Vercel Hobby Free.

This stack is the best fit for the current goal because it keeps the app free, removes VM maintenance, keeps frontend and backend code together, and still supports real database-backed private workout tracking.
