import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout'
import { getCurrentUserOrThrow } from '@/lib/auth/guards'
import { updateExerciseAction } from '@/features/exercises/actions'
import { ExerciseForm } from '@/features/exercises/components'
import { getExerciseByIdForUser } from '@/features/exercises/queries'

type EditExercisePageProps = {
  params: Promise<{
    exerciseId: string
  }>
  searchParams?: Promise<{
    error?: string
  }>
}

const errorMessages: Record<string, string> = {
  'invalid-input': 'Check the exercise details and try again.',
  'duplicate-name': 'An exercise with this name already exists.',
}

export const metadata: Metadata = {
  title: 'Edit Exercise',
}

export default async function EditExercisePage({ params, searchParams }: EditExercisePageProps) {
  const [{ exerciseId }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const user = await getCurrentUserOrThrow()
  const exercise = await getExerciseByIdForUser(user.id, exerciseId)

  if (!exercise) {
    notFound()
  }

  const errorMessage = resolvedSearchParams?.error
    ? errorMessages[resolvedSearchParams.error]
    : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Exercise library"
        title={`Edit ${exercise.name}`}
        description="Update this exercise for future workout planning."
      />

      <ExerciseForm
        action={updateExerciseAction.bind(null, exercise.id)}
        mode="edit"
        defaultValues={{
          name: exercise.name,
          description: exercise.description,
          category: exercise.category,
          imageBlobUrl: exercise.imageBlobUrl ?? '',
        }}
        errorMessage={errorMessage}
        cancelHref={`/exercises/${exercise.id}`}
      />
    </div>
  )
}
