import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout'
import { ExerciseForm } from '@/features/exercises/components'
import { createExerciseAction } from '@/features/exercises/actions'

export const metadata: Metadata = {
  title: 'New Exercise',
}

const errorMessages: Record<string, string> = {
  'invalid-input': 'Check the exercise details and try again.',
  'duplicate-name': 'An exercise with this name already exists.',
}

type NewExercisePageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function NewExercisePage({ searchParams }: NewExercisePageProps) {
  const params = await searchParams
  const errorMessage = params?.error ? errorMessages[params.error] : undefined

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Exercise library"
        title="New exercise"
        description="Create a reusable exercise with a category, description, and optional image."
      />

      <ExerciseForm action={createExerciseAction} mode="create" errorMessage={errorMessage} />
    </div>
  )
}
