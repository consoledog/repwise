import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/common'
import { getCurrentUserOrThrow } from '@/lib/auth/guards'
import { updateWorkoutAction } from '@/features/workouts/actions'
import { WorkoutForm } from '@/features/workouts/components'
import { getWorkoutByIdForUser, getWorkoutFormOptionsForUser } from '@/features/workouts/queries'
import { canEditWorkout } from '@/features/workouts/types'

export const metadata: Metadata = { title: 'Edit Workout' }

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>
}) {
  const { workoutId } = await params
  const user = await getCurrentUserOrThrow()
  const workout = await getWorkoutByIdForUser(user.id, workoutId)
  if (!workout) notFound()
  if (!canEditWorkout(workout))
    return (
      <EmptyState
        title="Workout planning is locked"
        description="This workout has started or contains recorded sets. Its exercise plan is preserved."
        action={
          <Link
            href={`/workouts/${workout.id}`}
            className="control-button control-button-secondary"
          >
            View workout
          </Link>
        }
      />
    )
  const options = await getWorkoutFormOptionsForUser(user.id)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workout builder"
        title={`Edit ${workout.name}`}
        description="Update your exercise order, targets, and schedule."
      />
      <WorkoutForm
        action={updateWorkoutAction.bind(null, workout.id)}
        options={options}
        cancelHref={`/workouts/${workout.id}`}
        defaultValues={{
          name: workout.name,
          notes: workout.notes ?? '',
          status: workout.status === 'PLANNED' ? 'PLANNED' : 'DRAFT',
          scheduledDate: workout.scheduledDate?.toISOString().slice(0, 10) ?? '',
          mesocycleId: workout.mesocycle?.id ?? '',
          exercises: workout.exercises.map((item) => ({
            exerciseId: item.exercise.id,
            targetSets: String(item.targetSets ?? 3),
            targetRepetitions:
              item.targetRepetitions === null ? '' : String(item.targetRepetitions),
            targetWeight: item.targetWeight === null ? '' : String(item.targetWeight),
            notes: item.notes ?? '',
          })),
        }}
      />
    </div>
  )
}
