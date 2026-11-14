import Link from 'next/link'
import { CalendarDays, Dumbbell } from 'lucide-react'
import { formatWorkoutDate, workoutStatusLabels, type WorkoutListItem } from '../types'

export function WorkoutCard({ workout }: { workout: WorkoutListItem }) {
  return (
    <article className="mobile-panel flex flex-col items-start gap-4 p-5">
      <span className="rounded-md bg-[var(--surface-subtle)] px-2 py-1 text-xs font-semibold text-[var(--brand-strong)]">
        {workoutStatusLabels[workout.status]}
      </span>
      <h2 className="text-lg font-semibold">
        <Link href={`/workouts/${workout.id}`} className="break-words hover:underline">
          {workout.name}
        </Link>
      </h2>
      <div className="space-y-2 text-sm text-zinc-600">
        <p className="flex items-center gap-2">
          <CalendarDays size={16} aria-hidden="true" />
          {formatWorkoutDate(workout.scheduledDate)}
        </p>
        <p className="flex items-center gap-2">
          <Dumbbell size={16} aria-hidden="true" />
          {workout.exerciseCount} exercises · {workout.targetSetCount} target sets
        </p>
        {workout.mesocycle && <p className="break-words">Mesocycle: {workout.mesocycle.name}</p>}
      </div>
      <Link
        href={`/workouts/${workout.id}`}
        className="control-button control-button-secondary mt-auto w-full"
      >
        View workout
      </Link>
    </article>
  )
}
