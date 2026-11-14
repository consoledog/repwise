import Link from 'next/link'
import { EmptyState } from '@/components/common'
import type { WorkoutListItem } from '../types'
import { WorkoutCard } from './WorkoutCard'

export function WorkoutList({ workouts }: { workouts: WorkoutListItem[] }) {
  if (workouts.length === 0)
    return (
      <EmptyState
        title="No workouts yet"
        description="Build your first workout from your exercise library."
        action={
          <Link href="/workouts/new" className="control-button control-button-primary">
            Create workout
          </Link>
        }
      />
    )
  return (
    <section aria-label="Workouts" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </section>
  )
}
