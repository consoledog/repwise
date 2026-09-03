# Repwise System Design Proposal

## Overview

Repwise should start as a full-stack Next.js modular monolith deployed on Vercel. The application is expected to be used by two people, so the design should optimize for simplicity, free-tier hosting, low maintenance, and fast iteration rather than distributed architecture.

The system should contain the React user interface, server-side application logic, API route handlers, authentication, database access, and file upload logic inside one Next.js application.

Important clarification: this is not a purely static React app. Repwise needs private user data, database writes, authentication, and image uploads. Next.js allows those backend concerns to live in the same project through Server Components, Server Actions, and Route Handlers.

## Recommended Architecture

### Architecture Style

The recommended architecture is a full-stack modular monolith.

This means:

- One application repository.
- One deployable Next.js application.
- React UI and backend logic in the same codebase.
- Clear internal feature modules.
- External managed services only for database and file storage.

Recommended modules:

- Authentication and user management.
- Exercise database.
- Workout planning.
- Workout tracking.
- Mesocycle management.
- Progress photo management.
- Reporting and progress analytics.

### Why Not Microservices

Microservices are not recommended for Repwise because the app has two expected users and no independent scaling requirements.

Microservices would introduce unnecessary complexity:

- Multiple deployments.
- Service-to-service communication.
- Distributed authorization.
- More monitoring.
- More infrastructure.
- Higher maintenance cost.

## Recommended Stack

### Application Framework

Recommended stack:

- Next.js 16.x, Active LTS as of the checked Next.js support policy.
- React.
- TypeScript.
- App Router.
- Server Components where appropriate.
- Server Actions for simple mutations.
- Route Handlers for upload endpoints, auth callbacks, and API-like behavior.

Next.js is the best fit if the goal is to host the whole application on Vercel while avoiding a separate Spring Boot backend and VM.

### Existing React Bootstrap Project

The existing `react_bootstrap` project should be used as a reference, not copied directly as-is.

Reusable ideas from `react_bootstrap`:

- TypeScript-first React code.
- Feature-based organization.
- React Hook Form and Zod for forms and validation.
- TanStack Query where client-side server-state fetching is still useful.
- Zustand for client-only draft state.
- Tailwind CSS styling approach.
- Error boundaries.
- Vitest, React Testing Library, and MSW testing style.
- ESLint, Prettier, Husky, and lint-staged workflow.

The Vite-specific parts should be replaced by Next.js equivalents:

- React Router becomes Next.js App Router.
- Vite environment variables become Next.js environment variables.
- Axios API calls are reduced where Server Actions or server-side data access are better.

### Database

Recommended database:

- PostgreSQL.

Recommended provider for a Vercel-first free setup:

- Neon Postgres Free plan through Vercel Marketplace, or directly from Neon.

Reasoning:

- Vercel Postgres is no longer available as a first-party product for new projects.
- Vercel now connects Postgres through Marketplace providers.
- Neon is a serverless Postgres provider designed to work well with Vercel.
- Neon Free currently includes 0.5 GB storage per project and 100 CU-hours monthly per project, which is enough for two personal users.

Alternative:

- Supabase PostgreSQL Free plan remains acceptable if Supabase Auth or Supabase Storage is preferred.

### Persistence and Migrations

Recommended persistence stack:

- Prisma ORM.
- Prisma Migrate.

Prisma is a better fit than Spring Data JPA once the backend is moved into a Next.js/TypeScript application.

Recommended database client approach:

- Use Prisma for schema definition, migrations, and type-safe queries.
- Use server-only data access modules to keep database access out of client components.
- Use connection pooling or provider-recommended serverless connection configuration.

### Authentication

Recommended authentication:

- Auth.js with credentials-based login for the MVP.
- Store users and hashed passwords in PostgreSQL.
- Disable public registration or protect it behind an invite/admin-only flow.

Reasoning:

- Only two users are expected.
- This avoids adding a separate hosted auth provider.
- Auth.js is a free open-source authentication library.
- Keeping registration closed reduces security and abuse risk.

Implementation rules:

- Use secure HTTP-only cookies.
- Hash passwords with bcrypt or Argon2.
- Validate all auth inputs with Zod.
- Never expose password hashes to the client.
- Centralize authorization checks in a server-side data access layer.

Alternative:

- Supabase Auth remains simpler if managed authentication is preferred, but it means auth is not fully inside the Vercel/Next.js app.

### File Storage

Recommended storage:

- Vercel Blob for MVP image storage.

Use Vercel Blob for:

- Exercise images.
- Mesocycle before photos.
- Mesocycle after photos.

Reasoning:

- It integrates naturally with a Vercel-hosted Next.js app.
- Hobby users currently get 1 GB/month Blob storage included.
- For two users, this can be enough if images are compressed before upload.

Rules:

- Store files in Vercel Blob.
- Store metadata and blob URLs/keys in PostgreSQL.
- Compress or resize progress photos before upload.
- Enforce file size and MIME type limits.
- Prefer private or hard-to-guess access patterns for sensitive body photos.

Alternative:

- Use Cloudflare R2 if photo storage grows beyond Vercel Blob free limits.

## Hosting Decision

### Final Hosting Recommendation

Repwise should be hosted as one full-stack Next.js application on Vercel Hobby Free.

Recommended setup:

```text
Full-stack Next.js app -> Vercel Hobby Free
Database -> Neon Postgres Free, connected through Vercel Marketplace or direct Neon connection
Auth -> Auth.js inside the Next.js app
Images -> Vercel Blob Hobby included usage
```

This removes the need for:

- Spring Boot backend.
- Oracle Cloud VM.
- Hetzner fallback VM.
- Separate backend deployment.
- Backend CORS between frontend and API.

### What "Everything on Vercel" Means

Vercel can host the application code, frontend, server-side logic, Server Actions, Route Handlers, preview deployments, environment variables, and Blob storage.

The database is still an external Postgres provider. For new projects, Vercel Postgres is no longer first-party; Vercel connects Postgres through Marketplace integrations such as Neon or Supabase.

So the practical definition is:

- One Vercel-hosted Next.js application.
- One external serverless Postgres database connected to the app.
- Vercel Blob for uploaded files.

This is still much simpler than running a separate VM.

### Free Tier Fit

For two users, the Vercel-first design should fit within free tiers if usage remains personal:

- Vercel Hobby: free for personal projects.
- Vercel Hobby currently includes 100 GB/month Fast Data Transfer and 1 million Edge Requests per month.
- Vercel Functions currently include 4 active CPU hours per month on Hobby.
- Vercel Blob currently includes 1 GB/month storage and 10 GB/month Blob Data Transfer on Hobby.
- Neon Free currently includes 0.5 GB storage per project and 100 CU-hours monthly per project.

Important risk:

- Free tiers can pause, block, or limit service when included usage is exceeded.
- Vercel Hobby does not charge overages, but the app can be paused if free-tier usage is exceeded.
- Vercel Blob access can stop until the usage window resets if Blob limits are exceeded.

For a private app used by two people, this risk is acceptable.

### Why This Is Better Than Oracle VM for This Project

The previous Oracle Always Free VM design was valid for a Spring Boot backend, but it created operational work:

- VM provisioning.
- Docker setup.
- Reverse proxy.
- TLS certificates.
- OS updates.
- Firewall maintenance.
- Monitoring.
- Idle resource risk.

With Next.js on Vercel, most of this disappears. The tradeoff is that backend code must be written in TypeScript instead of Spring Boot/Java.

## High-Level Components

### Next.js App

The Next.js app is responsible for:

- Rendering the mobile-first UI.
- Authentication screens and session handling.
- Exercise database screens.
- Workout creation and active tracking screens.
- Mesocycle screens.
- Progress photo upload and review.
- Server Actions and Route Handlers.
- Server-side database access.

### Data Access Layer

The data access layer is responsible for:

- Checking the current session.
- Enforcing `userId` ownership.
- Querying PostgreSQL.
- Returning safe DTOs to UI code.

No client component should directly access database credentials or perform authorization-sensitive logic.

### Database

PostgreSQL stores:

- Users.
- Exercises.
- Workouts.
- Workout exercises.
- Workout sets.
- Mesocycles.
- Progress photo metadata.

### Blob Storage

Vercel Blob stores:

- Exercise images.
- Before progress photos.
- After progress photos.

PostgreSQL stores the relationship between uploaded files and domain entities.

## Proposed Database Entities

### User

- `id`
- `email`
- `name`
- `passwordHash`
- `createdAt`
- `updatedAt`

### Exercise

- `id`
- `userId`
- `name`
- `description`
- `category`
- `imageBlobUrl`
- `source`
- `externalSourceId`
- `createdAt`
- `updatedAt`

### Workout

- `id`
- `userId`
- `mesocycleId`
- `name`
- `scheduledDate`
- `completedAt`
- `status`
- `notes`
- `createdAt`
- `updatedAt`

### WorkoutExercise

- `id`
- `workoutId`
- `exerciseId`
- `order`
- `targetSets`
- `targetRepetitions`
- `targetWeight`
- `notes`

### WorkoutSet

- `id`
- `workoutExerciseId`
- `setNumber`
- `repetitions`
- `weight`
- `completed`
- `notes`

### Mesocycle

- `id`
- `userId`
- `name`
- `plannedWorkoutCount`
- `startDate`
- `endDate`
- `status`
- `notes`
- `createdAt`
- `updatedAt`

### ProgressPhoto

- `id`
- `userId`
- `mesocycleId`
- `type`
- `blobUrl`
- `takenAt`
- `createdAt`

The `type` field should identify whether the photo is a `before` or `after` photo.

## Application Routes

Recommended App Router structure:

```text
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (app)/
│   ├── dashboard/
│   ├── exercises/
│   ├── workouts/
│   ├── mesocycles/
│   └── progress/
├── api/
│   ├── auth/
│   └── uploads/
└── layout.tsx
```

Use pages for route-level UI, Server Actions for mutations, and Route Handlers for upload flows or endpoints that need HTTP-specific behavior.

## External Exercise API Strategy

The application should not depend on an external exercise API for core functionality.

Recommended approach:

- Build the manual exercise database first.
- Add an external API integration later as an optional import/search feature.
- Store imported exercises locally after the user selects them.
- Allow users to edit imported exercise data after import.

## Security Considerations

- All user data must be scoped by `userId`.
- Public registration should be disabled for the MVP or protected by an invite/admin-only mechanism.
- Body progress photos should be treated as private data.
- Validate all inputs on the server.
- Use secure HTTP-only cookies for sessions.
- Hash passwords before storing them.
- Keep database credentials and Blob tokens server-side only.
- Set file type and file size limits for uploaded images.
- Do not expose server-only modules to client components.

## Development Phases

### Phase 1: MVP

- Next.js application scaffold.
- Auth.js credentials login.
- PostgreSQL schema with Prisma.
- Manual exercise database.
- Workout creation.
- Workout tracking with sets, repetitions, and weight.
- Mesocycle creation.
- Before and after progress photo upload with Vercel Blob.
- Vercel deployment.

### Phase 2: Better Training Experience

- Workout templates.
- Exercise search and filters.
- Workout history.
- Mesocycle progress view.
- Basic charts for volume and completed workouts.
- PWA manifest and installable mobile experience.

### Phase 3: Integrations and Analytics

- Optional external exercise API import.
- Personal records.
- Advanced analytics.
- Body measurements.
- Offline workout draft support.
- Notifications and reminders.

## Final Recommendation

Repwise should move to a full-stack Next.js architecture hosted on Vercel Hobby Free.

Recommended first implementation:

- Next.js 16.x with React and TypeScript.
- Tailwind CSS.
- Prisma ORM with PostgreSQL.
- Neon Postgres Free through Vercel Marketplace or direct Neon connection.
- Auth.js credentials-based authentication.
- Vercel Blob for image storage.
- Vercel Hobby Free for deployment.

This is the simplest architecture that can keep the project close to $0 while avoiding VM maintenance and keeping frontend/backend code in one application.

## Reference Notes

The technology and free tier recommendations were checked on 2026-09-03. Pricing and limits can change, so they should be rechecked before production launch.

- Next.js support policy: Next.js 16.x is listed as Active LTS. Source: https://nextjs.org/support-policy
- Vercel Hobby plan: free for personal projects, with 100 GB/month Fast Data Transfer and 1 million Edge Requests per month included. Source: https://vercel.com/pricing
- Vercel Hobby usage behavior: Hobby plans are paused when they exceed included free tier usage. Source: https://vercel.com/docs/plans
- Vercel Blob Hobby usage: includes 1 GB/month storage and 10 GB/month Blob Data Transfer. Source: https://vercel.com/docs/vercel-blob/usage-and-pricing
- Vercel Postgres status: Vercel Postgres is no longer available for new projects; Postgres is connected through Marketplace providers. Source: https://vercel.com/docs/postgres
- Neon Free plan: includes 0.5 GB storage per project and 100 CU-hours monthly per project. Source: https://neon.com/pricing
