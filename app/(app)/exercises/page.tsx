import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { getCurrentUserOrThrow } from '@/lib/auth/guards'
import { ExerciseFilters, ExerciseList } from '@/features/exercises/components'
import { listExercisesForUser, parseExerciseFilters } from '@/features/exercises/queries'

export const metadata: Metadata = {
  title: 'Exercises',
}

type ExercisesPageProps = {
  searchParams?: Promise<{
    search?: string
    category?: string
    deleted?: string
  }>
}

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
  const params = await searchParams
  const filters = parseExerciseFilters(params)
  const user = await getCurrentUserOrThrow()
  const exercises = await listExercisesForUser(user.id, filters)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Exercise library"
        title="Exercises"
        description="Create and manage reusable exercises for workout planning."
        actions={
          <Link href="/exercises/new" className="control-button control-button-primary">
            <Plus size={18} aria-hidden="true" />
            <span>New exercise</span>
          </Link>
        }
      />

      {params?.deleted === '1' ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-[var(--brand-strong)]">
          Exercise deleted.
        </p>
      ) : null}

      <ExerciseFilters filters={filters} />
      <ExerciseList exercises={exercises} filters={filters} />
    </div>
  )
}
