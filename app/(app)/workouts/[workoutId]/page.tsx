import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit3 } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { getCurrentUserOrThrow } from '@/lib/auth/guards'
import { getWorkoutByIdForUser } from '@/features/workouts/queries'
import { canEditWorkout, formatWorkoutDate, workoutStatusLabels } from '@/features/workouts/types'

export const metadata: Metadata = { title: 'Workout' }

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ workoutId: string }>
}) {
  const { workoutId } = await params
  const user = await getCurrentUserOrThrow()
  const workout = await getWorkoutByIdForUser(user.id, workoutId)
  if (!workout) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workout"
        title={workout.name}
        description="Review your exercise order and targets for this session."
        actions={
          <>
            <Link href="/workouts" className="control-button control-button-secondary">
              <ArrowLeft size={17} aria-hidden="true" />
              Workouts
            </Link>
            {canEditWorkout(workout) && (
              <Link
                href={`/workouts/${workout.id}/edit`}
                className="control-button control-button-secondary"
              >
                <Edit3 size={17} aria-hidden="true" />
                Edit
              </Link>
            )}
          </>
        }
      />
      <section className="mobile-panel space-y-4 p-5" aria-label="Workout details">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-sm font-semibold text-[var(--brand-strong)]">
            {workoutStatusLabels[workout.status]}
          </span>
          <span className="rounded-md bg-[var(--surface-subtle)] px-2 py-1 text-sm">
            {formatWorkoutDate(workout.scheduledDate)}
          </span>
          <span className="rounded-md bg-[var(--surface-subtle)] px-2 py-1 text-sm">
            {workout.exerciseCount} exercises · {workout.targetSetCount} target sets
          </span>
        </div>
        {workout.mesocycle && (
          <p className="text-sm text-zinc-600">Mesocycle: {workout.mesocycle.name}</p>
        )}
        {workout.notes && (
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-700">
            {workout.notes}
          </p>
        )}
        {!canEditWorkout(workout) && (
          <p className="text-sm text-zinc-600">
            Planning is locked because this workout has started or contains recorded sets.
          </p>
        )}
      </section>
      <section aria-labelledby="workout-exercises-heading" className="space-y-3">
        <h2 id="workout-exercises-heading" className="text-lg font-semibold">
          Exercises
        </h2>
        <ol className="space-y-3">
          {workout.exercises.map((item, index) => (
            <li key={item.id} className="mobile-panel space-y-3 p-5">
              <h3 className="break-words font-semibold">
                {index + 1}.{' '}
                <Link href={`/exercises/${item.exercise.id}`} className="hover:underline">
                  {item.exercise.name}
                </Link>
              </h3>
              <dl className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-zinc-500">Sets</dt>
                  <dd className="mt-1 font-semibold">{item.targetSets ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Reps per set</dt>
                  <dd className="mt-1 font-semibold">{item.targetRepetitions ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Weight</dt>
                  <dd className="mt-1 font-semibold">
                    {item.targetWeight !== null ? `${item.targetWeight} kg` : '—'}
                  </dd>
                </div>
              </dl>
              {item.notes && (
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-600">
                  {item.notes}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
