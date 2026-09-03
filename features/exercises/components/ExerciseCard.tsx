import Link from 'next/link'
import { Edit3, ExternalLink } from 'lucide-react'
import { ImagePreview } from '@/components/common'
import type { ExerciseListItem } from '../types'
import { exerciseCategoryOptions, exerciseSourceLabels } from '../types'
import { DeleteExerciseButton } from './DeleteExerciseButton'

type ExerciseCardProps = {
  exercise: ExerciseListItem
}

function getCategoryLabel(category: ExerciseListItem['category']) {
  return exerciseCategoryOptions.find((option) => option.value === category)?.label ?? category
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <article className="mobile-panel overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[14rem_1fr]">
        <ImagePreview src={exercise.imageBlobUrl} alt={exercise.name} framed={false} />

        <div className="flex min-w-0 flex-col p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-[var(--brand-strong)]">
              {getCategoryLabel(exercise.category)}
            </span>
            <span className="rounded-md bg-[var(--surface-subtle)] px-2 py-1 text-xs font-semibold text-zinc-600">
              {exerciseSourceLabels[exercise.source]}
            </span>
            {exercise.workoutUsageCount > 0 ? (
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-[var(--blue)]">
                Used {exercise.workoutUsageCount}x
              </span>
            ) : null}
          </div>

          <Link href={`/exercises/${exercise.id}`} className="mt-3 group">
            <h2 className="text-xl font-semibold text-zinc-950 group-hover:underline">
              {exercise.name}
            </h2>
          </Link>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
            {exercise.description}
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Link
              href={`/exercises/${exercise.id}`}
              className="control-button control-button-secondary"
            >
              <ExternalLink size={17} aria-hidden="true" />
              <span>Open</span>
            </Link>
            <Link
              href={`/exercises/${exercise.id}/edit`}
              className="control-button control-button-secondary"
            >
              <Edit3 size={17} aria-hidden="true" />
              <span>Edit</span>
            </Link>
            <DeleteExerciseButton exerciseId={exercise.id} exerciseName={exercise.name} />
          </div>
        </div>
      </div>
    </article>
  )
}
