import 'server-only'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db/prisma'
import { exerciseFilterSchema } from './schemas'
import type { ExerciseDetail, ExerciseFilters, ExerciseListItem } from './types'

type RawSearchParams = {
  search?: string | string[]
  category?: string | string[]
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export function parseExerciseFilters(searchParams?: RawSearchParams): ExerciseFilters {
  return exerciseFilterSchema.parse({
    search: firstParam(searchParams?.search) ?? '',
    category: firstParam(searchParams?.category) ?? 'ALL',
  })
}

export async function listExercisesForUser(
  userId: string,
  filters: ExerciseFilters
): Promise<ExerciseListItem[]> {
  const where: Prisma.ExerciseWhereInput = {
    userId,
    ...(filters.category !== 'ALL' ? { category: filters.category } : {}),
    ...(filters.search
      ? {
          OR: [
            {
              name: {
                contains: filters.search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: filters.search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {}),
  }

  const exercises = await prisma.exercise.findMany({
    where,
    orderBy: [{ updatedAt: 'desc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      imageBlobUrl: true,
      source: true,
      updatedAt: true,
      _count: {
        select: {
          workoutExercises: true,
        },
      },
    },
  })

  return exercises.map(({ _count, ...exercise }) => ({
    ...exercise,
    workoutUsageCount: _count.workoutExercises,
  }))
}

export async function getExerciseByIdForUser(
  userId: string,
  exerciseId: string
): Promise<ExerciseDetail | null> {
  const exercise = await prisma.exercise.findFirst({
    where: {
      id: exerciseId,
      userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      imageBlobUrl: true,
      source: true,
      externalSourceId: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          workoutExercises: true,
        },
      },
    },
  })

  if (!exercise) {
    return null
  }

  const { _count, ...detail } = exercise

  return {
    ...detail,
    workoutUsageCount: _count.workoutExercises,
  }
}

export async function getExerciseCountForUser(userId: string) {
  return prisma.exercise.count({
    where: {
      userId,
    },
  })
}
