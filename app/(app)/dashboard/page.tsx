import type { Metadata } from 'next'
import Link from 'next/link'
import { Activity, Camera, Dumbbell, Library, Plus } from 'lucide-react'
import { EmptyState } from '@/components/common'
import { PageHeader } from '@/components/layout'
import { getCurrentUserOrThrow } from '@/lib/auth/guards'
import { getExerciseCountForUser } from '@/features/exercises/queries'
import { getWorkoutCountForUser } from '@/features/workouts/queries'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const user = await getCurrentUserOrThrow()
  const [exerciseCount, workoutCount] = await Promise.all([
    getExerciseCountForUser(user.id),
    getWorkoutCountForUser(user.id),
  ])
  const summaryItems = [
    {
      label: 'Exercises',
      value: String(exerciseCount),
      icon: Library,
      color: 'text-[var(--brand)]',
    },
    { label: 'Workouts', value: String(workoutCount), icon: Dumbbell, color: 'text-[var(--blue)]' },
    { label: 'Mesocycles', value: '0', icon: Activity, color: 'text-[var(--amber)]' },
    { label: 'Photos', value: '0', icon: Camera, color: 'text-zinc-700' },
  ] as const

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Training overview"
        description="Start by building your exercise library, then create workouts and group them into mesocycles."
        actions={
          <Link href="/workouts/new" className="control-button control-button-primary">
            <Plus size={18} aria-hidden="true" />
            <span>New workout</span>
          </Link>
        }
      />

      <section aria-label="Summary" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {summaryItems.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.label} className="mobile-panel p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-zinc-600">{item.label}</p>
                <Icon className={item.color} size={19} aria-hidden="true" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-zinc-950">{item.value}</p>
            </div>
          )
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <EmptyState
            title={workoutCount > 0 ? 'Your workouts' : 'Plan your first workout'}
            description="Build and review sessions using exercises from your library."
            action={
              <Link href="/workouts" className="control-button control-button-secondary">
                <Dumbbell size={17} aria-hidden="true" />
                <span>Open workouts</span>
              </Link>
            }
          />

          <div className="mobile-panel p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Today</h2>
            <div className="mt-4 grid gap-3">
              <div className="rounded-lg bg-[var(--surface-subtle)] p-4">
                <p className="text-sm font-semibold text-zinc-950">Active workout</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Plan your exercise order and targets before training. Live set tracking is coming
                  next.
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-[var(--brand-strong)]">Next step</p>
                <p className="mt-1 text-sm leading-6 text-zinc-700">
                  Save a workout as a draft or choose a date and schedule your session.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="mobile-panel p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            <Link
              href="/exercises"
              className="control-button control-button-secondary justify-start"
            >
              <Library size={17} aria-hidden="true" />
              <span>Manage exercises</span>
            </Link>
            <Link
              href="/workouts/new"
              className="control-button control-button-secondary justify-start"
            >
              <Dumbbell size={17} aria-hidden="true" />
              <span>Create workout</span>
            </Link>
            <Link
              href="/mesocycles"
              className="control-button control-button-secondary justify-start"
            >
              <Activity size={17} aria-hidden="true" />
              <span>Plan mesocycle</span>
            </Link>
            <Link
              href="/progress"
              className="control-button control-button-secondary justify-start"
            >
              <Camera size={17} aria-hidden="true" />
              <span>Add photos</span>
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
