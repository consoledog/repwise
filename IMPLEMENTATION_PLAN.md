# Repwise Implementation Plan

## Purpose

This document is the implementation checklist for Repwise. It should be updated continuously as features are implemented.

Checkbox meaning:

- `[ ]` Not started.
- `[x]` Completed.

The current product direction is a full-stack Next.js application hosted on Vercel Hobby Free, using PostgreSQL, Prisma, Auth.js, and Vercel Blob.

## Phase 0: Documentation and Decisions

- [x] Create `PROJECT_SPECIFICATION.md`.
- [x] Create `SYSTEM_DESIGN.md`.
- [x] Create `TECH_STACK.md`.
- [x] Keep this implementation plan updated after each completed step.

## Phase 1: Project Scaffold

Goal: create the initial Next.js project structure and baseline developer workflow.

### Root Files

- [x] Create `package.json`.
- [x] Create `package-lock.json`.
- [x] Create `tsconfig.json`.
- [x] Create `next.config.ts`.
- [x] Create `postcss.config.mjs`.
- [x] Create `eslint.config.mjs`.
- [x] Create `vitest.config.ts`.
- [x] Create `.prettierrc`.
- [x] Create `.gitignore`.
- [x] Create `.env.example`.
- [x] Create `.env.local` locally and keep it untracked.
- [x] Create `README.md` update for local development commands.

### App Router Base

- [x] Create `app/layout.tsx`.
- [x] Create `app/page.tsx`.
- [x] Create `app/globals.css`.
- [x] Create `app/not-found.tsx`.
- [x] Create `app/loading.tsx`.
- [x] Create `app/error.tsx`.

### Shared Structure

- [x] Create `components/common/`.
- [x] Create `components/layout/`.
- [x] Create `components/ui/`.
- [x] Create `features/`.
- [x] Create `lib/`.
- [x] Create `prisma/`.
- [x] Create `tests/`.

### Developer Commands

- [x] Add `dev` script.
- [x] Add `build` script.
- [x] Add `start` script.
- [x] Add `lint` script.
- [x] Add `format` script.
- [x] Add `type-check` script.
- [x] Add `test` script.
- [x] Add `test:run` script.

## Phase 2: Styling, Layout, and App Shell

Goal: build the mobile-first shell before implementing domain features.

### Global Styling

- [x] Configure Tailwind CSS.
- [x] Define base colors, spacing, typography, and form styles in `app/globals.css`.
- [x] Add mobile-first layout constraints.
- [x] Add accessible focus states.
- [x] Add reusable button, input, card, and page section classes only if needed.

### Layout Components

- [x] Create `components/layout/AppShell.tsx`.
- [x] Create `components/layout/AppHeader.tsx`.
- [x] Create `components/layout/BottomNavigation.tsx`.
- [x] Create `components/layout/PageHeader.tsx`.
- [x] Create `components/layout/index.ts`.

### Common Components

- [x] Create `components/common/LoadingState.tsx`.
- [x] Create `components/common/ErrorState.tsx`.
- [x] Create `components/common/EmptyState.tsx`.
- [x] Create `components/common/ConfirmDialog.tsx`.
- [x] Create `components/common/ImagePreview.tsx`.
- [x] Create `components/common/index.ts`.

### App Routes

- [x] Create `app/(app)/layout.tsx`.
- [x] Create `app/(app)/dashboard/page.tsx`.
- [x] Redirect root users from `app/page.tsx` based on authentication state.
- [x] Create placeholder pages for `/exercises`, `/workouts`, `/workouts/new`, `/mesocycles`, and `/progress` so shell navigation does not hit 404 routes.

## Phase 3: Database and Prisma

Goal: define the database schema and local database workflow.

### Prisma Setup

- [x] Install `prisma` and `@prisma/client`.
- [x] Create `prisma/schema.prisma`.
- [x] Configure PostgreSQL datasource.
- [x] Configure Prisma client generator.
- [x] Create `lib/db/prisma.ts`.
- [x] Add `prisma:generate` script.
- [x] Add `prisma:migrate` script.
- [x] Add `prisma:studio` script.
- [x] Create initial migration SQL file.

### Database Models

- [x] Add `User` model.
- [x] Add Auth.js support models: `Account`, `Session`, and `VerificationToken`.
- [x] Add `Exercise` model.
- [x] Add `Workout` model.
- [x] Add `WorkoutExercise` model.
- [x] Add `WorkoutSet` model.
- [x] Add `Mesocycle` model.
- [x] Add `ProgressPhoto` model.

### Database Enums

- [x] Add `ExerciseCategory` enum: `AEROBIC`, `ANAEROBIC`, `FLEXIBILITY`.
- [x] Add `WorkoutStatus` enum: `DRAFT`, `PLANNED`, `IN_PROGRESS`, `COMPLETED`.
- [x] Add `MesocycleStatus` enum: `PLANNED`, `ACTIVE`, `COMPLETED`.
- [x] Add `ProgressPhotoType` enum: `BEFORE`, `AFTER`.
- [x] Add `ExerciseSource` enum: `MANUAL`, `EXTERNAL`.

### Database Constraints and Indexes

- [x] Add `userId` relation to user-owned tables.
- [x] Add indexes for common `userId` queries.
- [x] Add ordering support for workout exercises.
- [x] Add uniqueness constraints where needed.
- [x] Add cascade behavior deliberately for child records.

### Local Database

- [x] Create `docker-compose.yml` for local PostgreSQL.
- [x] Document local database setup in `README.md`.
- [x] Run first local migration.
- [x] Verify Prisma Client generation.

## Phase 4: Authentication

Goal: support private access for the two intended users.

### Auth.js Setup

- [x] Install Auth.js dependencies.
- [x] Create `auth.ts`.
- [x] Create `app/api/auth/[...nextauth]/route.ts`.
- [x] Create `lib/auth/password.ts`.
- [x] Create `lib/auth/session.ts`.
- [x] Create `lib/auth/guards.ts`.
- [x] Configure `AUTH_SECRET`.

### User Creation

- [x] Create `prisma/seed.ts`.
- [x] Add seed script to create initial allowed users.
- [x] Add password hashing in seed script.
- [x] Document how to create the two personal users.
- [x] Disable open public registration for MVP.

### Auth UI

- [x] Create `app/(auth)/login/page.tsx`.
- [x] Create `features/auth/components/LoginForm.tsx`.
- [x] Create `features/auth/actions.ts`.
- [x] Create `features/auth/schemas.ts`.
- [x] Create `features/auth/types.ts`.
- [x] Add logout action.
- [x] Add auth redirects for signed-in and signed-out users.

### Authorization

- [x] Protect `app/(app)/layout.tsx`.
- [x] Establish authenticated `userId` helper for future queries.
- [x] Establish authenticated `userId` helper for future mutations.
- [x] Add server-side helper for `getCurrentUserOrThrow`.

## Phase 5: Exercise Database

Goal: allow users to create and manage reusable exercises.

### Exercise Files

- [x] Create `features/exercises/schemas.ts`.
- [x] Create `features/exercises/types.ts`.
- [x] Create `features/exercises/queries.ts`.
- [x] Create `features/exercises/actions.ts`.
- [x] Create `features/exercises/components/ExerciseForm.tsx`.
- [x] Create `features/exercises/components/ExerciseList.tsx`.
- [x] Create `features/exercises/components/ExerciseCard.tsx`.
- [x] Create `features/exercises/components/ExerciseFilters.tsx`.
- [x] Create `features/exercises/components/ExerciseImageField.tsx`.
- [x] Create `features/exercises/components/index.ts`.

### Exercise Routes

- [x] Create `app/(app)/exercises/page.tsx`.
- [x] Create `app/(app)/exercises/new/page.tsx`.
- [x] Create `app/(app)/exercises/[exerciseId]/page.tsx`.
- [x] Create `app/(app)/exercises/[exerciseId]/edit/page.tsx`.

### Exercise Features

- [x] List exercises for current user.
- [x] Create exercise.
- [x] Edit exercise.
- [x] Delete exercise.
- [x] Filter exercises by category.
- [x] Search exercises by name.
- [x] Support optional image.
- [x] Support exercise description.
- [x] Store exercise source as manual or external.

## Phase 6: File Uploads and Vercel Blob

Goal: upload and store exercise images and progress photos.

### Storage Files

- [x] Install Vercel Blob package.
- [x] Create `lib/storage/blob.ts`.
- [x] Create `lib/storage/image-validation.ts`.
- [x] Create `app/api/uploads/route.ts`.
- [x] Add `BLOB_READ_WRITE_TOKEN` to `.env.example`.

### Upload Rules

- [x] Restrict upload access to authenticated users.
- [x] Validate MIME type.
- [x] Validate file size.
- [x] Generate stable object names.
- [x] Store blob URL or key in PostgreSQL.
- [x] Add client-side image compression before upload.
- [x] Add delete flow for replaced images where possible.

## Phase 7: Workout Creation

Goal: allow users to build workouts from existing exercises.

### Workout Files

- [x] Create `features/workouts/schemas.ts`.
- [x] Create `features/workouts/types.ts`.
- [x] Create `features/workouts/queries.ts`.
- [x] Create `features/workouts/actions.ts`.
- [x] Create `features/workouts/mutations.ts` for atomic ownership-checked persistence.
- [x] Create `features/workouts/components/WorkoutForm.tsx`.
- [x] Create `features/workouts/components/ExercisePicker.tsx`.
- [x] Create `features/workouts/components/WorkoutExerciseEditor.tsx`.
- [x] Create `features/workouts/components/WorkoutSetTargetEditor.tsx`.
- [x] Create `features/workouts/components/WorkoutList.tsx`.
- [x] Create `features/workouts/components/WorkoutCard.tsx`.
- [x] Create `features/workouts/components/index.ts`.

### Workout Routes

- [x] Create `app/(app)/workouts/page.tsx`.
- [x] Create `app/(app)/workouts/new/page.tsx`.
- [x] Create `app/(app)/workouts/[workoutId]/page.tsx`.
- [x] Create `app/(app)/workouts/[workoutId]/edit/page.tsx`.

### Workout Features

- [x] Create workout.
- [x] Add exercises to workout.
- [x] Reorder workout exercises.
- [x] Define target sets.
- [x] Define target repetitions.
- [x] Define target weight.
- [x] Save workout as draft.
- [x] Schedule workout.
- [x] Assign workout to mesocycle optionally.

### Verification

- [x] Verify schema and Server Action validation, authentication, and form interactions.
- [x] Verify PostgreSQL persistence, exercise order, scheduling, mesocycle ownership, and protection of recorded sets with local integration tests.
- [x] Run type checking, lint, tests, and a production build.
- [x] Document manual testing and the opt-in local database tests in `README.md`.

## Phase 8: Active Workout Tracking

Goal: make workout tracking fast during training.

### Active Workout Files

- [ ] Create `features/workouts/components/ActiveWorkout.tsx`.
- [ ] Create `features/workouts/components/ActiveExercise.tsx`.
- [ ] Create `features/workouts/components/SetTracker.tsx`.
- [ ] Create `features/workouts/components/WeightInput.tsx`.
- [ ] Create `features/workouts/components/RepetitionInput.tsx`.
- [ ] Create `features/workouts/components/WorkoutCompletionDialog.tsx`.
- [ ] Create `features/workouts/stores/activeWorkoutStore.ts`.

### Active Workout Routes

- [ ] Create `app/(app)/workouts/[workoutId]/track/page.tsx`.

### Active Workout Features

- [ ] Start workout.
- [ ] Mark workout as in progress.
- [ ] Record repetitions per set.
- [ ] Record weight per set.
- [ ] Mark individual sets complete.
- [ ] Add extra set during workout.
- [ ] Remove unneeded set during workout.
- [ ] Save partial progress.
- [ ] Complete workout.
- [ ] Preserve completed workout history.

## Phase 9: Mesocycle Management

Goal: group workouts into a larger training block.

### Mesocycle Files

- [ ] Create `features/mesocycles/schemas.ts`.
- [ ] Create `features/mesocycles/types.ts`.
- [ ] Create `features/mesocycles/queries.ts`.
- [ ] Create `features/mesocycles/actions.ts`.
- [ ] Create `features/mesocycles/components/MesocycleForm.tsx`.
- [ ] Create `features/mesocycles/components/MesocycleList.tsx`.
- [ ] Create `features/mesocycles/components/MesocycleCard.tsx`.
- [ ] Create `features/mesocycles/components/MesocycleProgress.tsx`.
- [ ] Create `features/mesocycles/components/MesocycleWorkoutList.tsx`.
- [ ] Create `features/mesocycles/components/index.ts`.

### Mesocycle Routes

- [ ] Create `app/(app)/mesocycles/page.tsx`.
- [ ] Create `app/(app)/mesocycles/new/page.tsx`.
- [ ] Create `app/(app)/mesocycles/[mesocycleId]/page.tsx`.
- [ ] Create `app/(app)/mesocycles/[mesocycleId]/edit/page.tsx`.

### Mesocycle Features

- [ ] Create mesocycle.
- [ ] Set planned workout count, for example 10.
- [ ] Add workouts to mesocycle.
- [ ] Show completed workout count.
- [ ] Show mesocycle progress percentage.
- [ ] Complete mesocycle.
- [ ] Edit mesocycle notes.

## Phase 10: Progress Photos

Goal: attach before and after body photos to mesocycles.

### Progress Photo Files

- [ ] Create `features/progress-photos/schemas.ts`.
- [ ] Create `features/progress-photos/types.ts`.
- [ ] Create `features/progress-photos/queries.ts`.
- [ ] Create `features/progress-photos/actions.ts`.
- [ ] Create `features/progress-photos/components/ProgressPhotoUploader.tsx`.
- [ ] Create `features/progress-photos/components/ProgressPhotoGrid.tsx`.
- [ ] Create `features/progress-photos/components/BeforeAfterComparison.tsx`.
- [ ] Create `features/progress-photos/components/index.ts`.

### Progress Photo Features

- [ ] Upload before photo.
- [ ] Upload after photo.
- [ ] Associate photo with mesocycle.
- [ ] Preview uploaded photos.
- [ ] Delete uploaded photo.
- [ ] Compare before and after photos.
- [ ] Enforce user ownership.

## Phase 11: Dashboard and History

Goal: provide a useful first screen after login.

### Dashboard Files

- [ ] Create `features/dashboard/queries.ts`.
- [ ] Create `features/dashboard/components/DashboardSummary.tsx`.
- [ ] Create `features/dashboard/components/CurrentMesocycleCard.tsx`.
- [ ] Create `features/dashboard/components/RecentWorkouts.tsx`.
- [ ] Create `features/dashboard/components/QuickActions.tsx`.
- [ ] Create `features/dashboard/components/index.ts`.

### Dashboard Features

- [ ] Show current active mesocycle.
- [ ] Show next planned workout.
- [ ] Show recent completed workouts.
- [ ] Show quick action to create exercise.
- [ ] Show quick action to create workout.
- [ ] Show quick action to start workout.

## Phase 12: Tests

Goal: add enough tests to protect critical behavior.

### Unit and Component Tests

- [ ] Configure Vitest.
- [ ] Configure React Testing Library.
- [ ] Configure MSW if route handlers or external calls need mocking.
- [ ] Add test setup file.
- [ ] Test login form validation.
- [ ] Test exercise form validation.
- [ ] Test workout set input behavior.
- [ ] Test mesocycle progress calculation.

### Backend Logic Tests

- [ ] Test auth guard helpers.
- [ ] Test user ownership checks.
- [ ] Test exercise actions.
- [x] Test workout actions.
- [ ] Test mesocycle actions.

### End-to-End Tests

- [ ] Add Playwright later if needed.
- [ ] Test login flow.
- [ ] Test create exercise flow.
- [ ] Test create and complete workout flow.
- [ ] Test create mesocycle and upload progress photo flow.

## Phase 13: CI/CD and Deployment

Goal: make validation and deployment repeatable.

### GitHub and Vercel

- [ ] Connect repository to Vercel.
- [ ] Configure Vercel project.
- [ ] Configure production environment variables.
- [ ] Configure preview environment variables.
- [ ] Connect Neon database.
- [ ] Connect Vercel Blob.

### GitHub Actions

- [ ] Create `.github/workflows/ci.yml`.
- [ ] Run `npm ci`.
- [ ] Run `npm run type-check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run test:run`.
- [ ] Run `npm run build`.
- [ ] Add Prisma validation.

### Deployment Validation

- [ ] Verify preview deployment.
- [ ] Verify production deployment.
- [ ] Verify login in production.
- [ ] Verify database connection in production.
- [ ] Verify image upload in production.

## Phase 14: PWA and Mobile Polish

Goal: make the web app feel good on phones.

- [ ] Add manifest.
- [ ] Add app icons.
- [ ] Add mobile viewport metadata.
- [ ] Add installable app behavior.
- [ ] Improve touch targets.
- [ ] Test on phone viewport.
- [ ] Test active workout screen on phone.
- [ ] Add offline draft support for active workouts.

## Phase 15: MVP Completion Checklist

The MVP is complete when:

- [ ] User can log in.
- [ ] User can create exercises.
- [ ] User can optionally attach exercise image.
- [ ] User can create workout from exercises.
- [ ] User can enter sets, repetitions, and weight.
- [ ] User can complete workout.
- [ ] User can view workout history.
- [ ] User can create mesocycle with planned workout count.
- [ ] User can attach before progress photo to mesocycle.
- [ ] User can attach after progress photo to mesocycle.
- [ ] User can view mesocycle progress.
- [ ] User data is private and scoped by authenticated user.
- [ ] App is deployed on Vercel.
- [ ] Database runs on Neon Free or equivalent free PostgreSQL provider.
- [ ] Image uploads work through Vercel Blob or selected storage provider.

## Update Rules

- Check off items only after they are implemented and verified.
- If a planned file changes name, update this document.
- If a feature is intentionally deferred, move it to a later phase instead of deleting it.
- Keep implementation details aligned with `PROJECT_SPECIFICATION.md`, `SYSTEM_DESIGN.md`, and `TECH_STACK.md`.
