import 'server-only'
import { prisma } from '@/lib/db/prisma'
import type { WorkoutInput } from './schemas'
import { editableWorkoutStatuses } from './schemas'

type SaveWorkoutResult =
  { id: string } | { error: 'not-found' | 'locked' | 'invalid-exercises' | 'invalid-mesocycle' }

export async function saveWorkoutForUser(
  userId: string,
  input: WorkoutInput,
  workoutId?: string
): Promise<SaveWorkoutResult> {
  return prisma.$transaction(
    async (tx) => {
      if (workoutId) {
        const existing = await tx.workout.findFirst({
          where: { id: workoutId, userId },
          select: { id: true },
        })
        if (!existing) return { error: 'not-found' }
      }

      const exerciseIds = input.exercises.map((exercise) => exercise.exerciseId)
      const count = await tx.exercise.count({ where: { userId, id: { in: exerciseIds } } })
      if (count !== exerciseIds.length) return { error: 'invalid-exercises' }
      if (input.mesocycleId) {
        const mesocycle = await tx.mesocycle.findFirst({
          where: { id: input.mesocycleId, userId },
          select: { id: true },
        })
        if (!mesocycle) return { error: 'invalid-mesocycle' }
      }

      const data = {
        name: input.name,
        notes: input.notes,
        status: input.status,
        scheduledDate: input.scheduledDate,
        mesocycleId: input.mesocycleId,
      }
      const exercises = input.exercises.map((exercise, order) => ({ ...exercise, order }))

      if (workoutId) {
        // Check eligibility in the write itself; never replace recorded workout sets.
        const updated = await tx.workout.updateMany({
          where: {
            id: workoutId,
            userId,
            status: { in: [...editableWorkoutStatuses] },
            startedAt: null,
            workoutExercises: { none: { sets: { some: {} } } },
          },
          data,
        })
        if (updated.count !== 1) return { error: 'locked' }
        await tx.workoutExercise.deleteMany({ where: { workoutId, workout: { userId } } })
        await tx.workoutExercise.createMany({
          data: exercises.map((exercise) => ({ ...exercise, workoutId })),
        })
        return { id: workoutId }
      }

      return tx.workout.create({
        data: { ...data, userId, workoutExercises: { create: exercises } },
        select: { id: true },
      })
    },
    { isolationLevel: 'Serializable' }
  )
}
