import Link from 'next/link'
import { Plus } from 'lucide-react'
import { EmptyState } from '@/components/common'
import type { ExerciseFilters, ExerciseListItem } from '../types'
import { ExerciseCard } from './ExerciseCard'

type ExerciseListProps = {
  exercises: ExerciseListItem[]
  filters: ExerciseFilters
}

function hasActiveFilters(filters: ExerciseFilters) {
  return Boolean(filters.search || filters.category !== 'ALL')
}

export function ExerciseList({ exercises, filters }: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <EmptyState
        title={hasActiveFilters(filters) ? 'No matching exercises' : 'No exercises yet'}
        description={
          hasActiveFilters(filters)
            ? 'Adjust the search or category filter to find another exercise.'
            : 'Create your first reusable exercise and use it later while building workouts.'
        }
        action={
          hasActiveFilters(filters) ? (
            <Link href="/exercises" className="control-button control-button-secondary">
              Clear filters
            </Link>
          ) : (
            <Link href="/exercises/new" className="control-button control-button-primary">
              <Plus size={17} aria-hidden="true" />
              <span>New exercise</span>
            </Link>
          )
        }
      />
    )
  }

  return (
    <section aria-label="Exercises" className="grid gap-4">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </section>
  )
}
