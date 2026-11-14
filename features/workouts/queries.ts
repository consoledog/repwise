import 'server-only'
import { prisma } from '@/lib/db/prisma'
import type { WorkoutDetail, WorkoutFormOptions, WorkoutListItem } from './types'

export async function getWorkoutFormOptionsForUser(userId: string): Promise<WorkoutFormOptions> {
  const [exercises, mesocycles] = await Promise.all([
    prisma.exercise.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, category: true },
    }),
    prisma.mesocycle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true },
    }),
  ])
  return { exercises, mesocycles }
}

export async function listWorkoutsForUser(userId: string): Promise<WorkoutListItem[]> {
  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
    select: {
      id: true,
      name: true,
      status: true,
      scheduledDate: true,
      mesocycle: { select: { id: true, name: true } },
      workoutExercises: { select: { targetSets: true } },
    },
  })
  return workouts.map(({ workoutExercises, ...workout }) => ({
    ...workout,
    exerciseCount: workoutExercises.length,
    targetSetCount: workoutExercises.reduce(
      (total, exercise) => total + (exercise.targetSets ?? 0),
      0
    ),
  }))
}

export async function getWorkoutByIdForUser(
  userId: string,
  workoutId: string
): Promise<WorkoutDetail | null> {
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
    select: {
      id: true,
      name: true,
      status: true,
      notes: true,
      scheduledDate: true,
      startedAt: true,
      completedAt: true,
      mesocycle: { select: { id: true, name: true } },
      workoutExercises: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          targetSets: true,
          targetRepetitions: true,
          targetWeight: true,
          notes: true,
          exercise: { select: { id: true, name: true, category: true } },
          _count: { select: { sets: true } },
        },
      },
    },
  })
  if (!workout) return null
  const { workoutExercises, ...detail } = workout
  return {
    ...detail,
    exerciseCount: workoutExercises.length,
    targetSetCount: workoutExercises.reduce(
      (total, exercise) => total + (exercise.targetSets ?? 0),
      0
    ),
    recordedSetCount: workoutExercises.reduce((total, exercise) => total + exercise._count.sets, 0),
    exercises: workoutExercises.map((exercise) => ({
      id: exercise.id,
      exercise: exercise.exercise,
      targetSets: exercise.targetSets,
      targetRepetitions: exercise.targetRepetitions,
      targetWeight: exercise.targetWeight?.toNumber() ?? null,
      notes: exercise.notes,
    })),
  }
}

export async function getWorkoutCountForUser(userId: string) {
  return prisma.workout.count({ where: { userId } })
}
