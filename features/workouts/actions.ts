'use server'

import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUserOrThrow } from '@/lib/auth/guards'
import { parseWorkoutForm, workoutIdSchema } from './schemas'
import { saveWorkoutForUser } from './mutations'
import type { WorkoutActionState } from './types'

async function saveWorkout(formData: FormData, workoutId?: string): Promise<WorkoutActionState> {
  const user = await getCurrentUserOrThrow()
  const parsed = parseWorkoutForm(formData)
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? 'Check the workout details.' }

  let result: Awaited<ReturnType<typeof saveWorkoutForUser>>
  try {
    result = await saveWorkoutForUser(user.id, parsed.data, workoutId)
  } catch (error) {
    // Concurrent changes and deleted exercise references can be retried without losing the form.
    const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : null
    if (code === 'P2034' || code === 'P2003' || code === 'P2025') {
      return {
        error:
          'The workout or exercise library changed while saving. Reload the page and try again.',
      }
    }
    throw error
  }

  if ('error' in result) {
    if (result.error === 'not-found') notFound()
    const messages = {
      locked:
        'This workout has started or contains recorded sets and can no longer be edited here.',
      'invalid-exercises':
        'An exercise is no longer available in your library. Reload the page and choose your exercises again.',
      'invalid-mesocycle': 'Choose a mesocycle that belongs to your account.',
    }
    return { error: messages[result.error] }
  }

  revalidatePath('/workouts')
  revalidatePath(`/workouts/${result.id}`)
  revalidatePath('/dashboard')
  revalidatePath('/exercises')
  revalidatePath('/exercises/[exerciseId]', 'page')
  redirect(`/workouts/${result.id}`)
}

export async function createWorkoutAction(_state: WorkoutActionState, formData: FormData) {
  return saveWorkout(formData)
}

export async function updateWorkoutAction(
  workoutId: string,
  _state: WorkoutActionState,
  formData: FormData
) {
  const parsedId = workoutIdSchema.safeParse(workoutId)
  if (!parsedId.success) notFound()
  return saveWorkout(formData, parsedId.data)
}
