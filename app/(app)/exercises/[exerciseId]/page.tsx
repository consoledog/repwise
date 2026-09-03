import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit3 } from 'lucide-react'
import { ImagePreview } from '@/components/common'
import { PageHeader } from '@/components/layout'
import { getCurrentUserOrThrow } from '@/lib/auth/guards'
import { getExerciseByIdForUser } from '@/features/exercises/queries'
import { DeleteExerciseButton } from '@/features/exercises/components'
import { exerciseCategoryOptions, exerciseSourceLabels } from '@/features/exercises/types'

type ExerciseDetailPageProps = {
  params: Promise<{
    exerciseId: string
  }>
  searchParams?: Promise<{
    error?: string
  }>
}

export const metadata: Metadata = {
  title: 'Exercise',
}

function getCategoryLabel(category: string) {
  return exerciseCategoryOptions.find((option) => option.value === category)?.label ?? category
}

export default async function ExerciseDetailPage({
  params,
  searchParams,
}: ExerciseDetailPageProps) {
  const [{ exerciseId }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const user = await getCurrentUserOrThrow()
  const exercise = await getExerciseByIdForUser(user.id, exerciseId)

  if (!exercise) {
    notFound()
  }

  const inUseError =
    resolvedSearchParams?.error === 'in-use'
      ? 'This exercise is already used in a workout and cannot be deleted.'
      : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Exercise"
        title={exercise.name}
        description="Review exercise details before using it in a workout."
        actions={
          <>
            <Link href="/exercises" className="control-button control-button-secondary">
              <ArrowLeft size={17} aria-hidden="true" />
              <span>Library</span>
            </Link>
            <Link
              href={`/exercises/${exercise.id}/edit`}
              className="control-button control-button-secondary"
            >
              <Edit3 size={17} aria-hidden="true" />
              <span>Edit</span>
            </Link>
            <DeleteExerciseButton exerciseId={exercise.id} exerciseName={exercise.name} />
          </>
        }
      />

      {inUseError ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {inUseError}
        </p>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[22rem_1fr]">
        <ImagePreview src={exercise.imageBlobUrl} alt={exercise.name} label={exercise.name} />

        <div className="space-y-4">
          <div className="mobile-panel p-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-[var(--brand-strong)]">
                {getCategoryLabel(exercise.category)}
              </span>
              <span className="rounded-md bg-[var(--surface-subtle)] px-2 py-1 text-xs font-semibold text-zinc-600">
                {exerciseSourceLabels[exercise.source]}
              </span>
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-[var(--blue)]">
                Used {exercise.workoutUsageCount}x
              </span>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-zinc-950">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
              {exercise.description}
            </p>
          </div>

          <dl className="mobile-panel grid gap-0 overflow-hidden sm:grid-cols-2">
            <div className="border-b border-[var(--border)] p-4 sm:border-r">
              <dt className="text-xs font-semibold uppercase text-zinc-500">Created</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-950">
                {exercise.createdAt.toLocaleDateString('en-US')}
              </dd>
            </div>
            <div className="border-b border-[var(--border)] p-4">
              <dt className="text-xs font-semibold uppercase text-zinc-500">Updated</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-950">
                {exercise.updatedAt.toLocaleDateString('en-US')}
              </dd>
            </div>
            <div className="p-4 sm:border-r">
              <dt className="text-xs font-semibold uppercase text-zinc-500">Source</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-950">
                {exerciseSourceLabels[exercise.source]}
              </dd>
            </div>
            <div className="p-4">
              <dt className="text-xs font-semibold uppercase text-zinc-500">External ID</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-950">
                {exercise.externalSourceId ?? 'None'}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
