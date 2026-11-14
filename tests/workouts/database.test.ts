// Opt in with TEST_DATABASE_URL pointing at a local, migrated PostgreSQL database.
import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { workoutFormSchema, type WorkoutInput } from '@/features/workouts/schemas'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/db/prisma', async () => {
  const { PrismaClient } = await import('@prisma/client')
  return { prisma: new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL }) }
})

import { prisma } from '@/lib/db/prisma'
import { saveWorkoutForUser } from '@/features/workouts/mutations'
import {
  getWorkoutByIdForUser,
  getWorkoutFormOptionsForUser,
  listWorkoutsForUser,
} from '@/features/workouts/queries'

const databaseUrl = process.env.TEST_DATABASE_URL
if (databaseUrl && !['localhost', '127.0.0.1', '[::1]'].includes(new URL(databaseUrl).hostname)) {
  throw new Error('Workout integration tests require a local PostgreSQL database.')
}

describe.skipIf(!databaseUrl)('workouts with PostgreSQL', () => {
  const suffix = randomUUID()
  let ownerId: string
  let otherId: string
  let firstExerciseId: string
  let secondExerciseId: string
  let foreignExerciseId: string
  let cycleId: string
  let foreignCycleId: string

  beforeAll(async () => {
    const owner = await prisma.user.create({
      data: { email: `phase7-owner-${suffix}@example.test` },
    })
    ownerId = owner.id
    const other = await prisma.user.create({
      data: { email: `phase7-other-${suffix}@example.test` },
    })
    otherId = other.id
    const first = await prisma.exercise.create({
      data: { userId: ownerId, name: 'Bench press', description: 'Test exercise' },
    })
    firstExerciseId = first.id
    secondExerciseId = (
      await prisma.exercise.create({
        data: {
          userId: ownerId,
          name: 'Running',
          description: 'Test exercise',
          category: 'AEROBIC',
        },
      })
    ).id
    foreignExerciseId = (
      await prisma.exercise.create({
        data: { userId: otherId, name: 'Private exercise', description: 'Test exercise' },
      })
    ).id
    cycleId = (
      await prisma.mesocycle.create({
        data: { userId: ownerId, name: 'Training block', plannedWorkoutCount: 10 },
      })
    ).id
    foreignCycleId = (
      await prisma.mesocycle.create({
        data: { userId: otherId, name: 'Private block', plannedWorkoutCount: 10 },
      })
    ).id
  })

  afterAll(async () => {
    const userIds = [ownerId, otherId].filter(Boolean)
    try {
      await prisma.workout.deleteMany({ where: { userId: { in: userIds } } })
      await prisma.user.deleteMany({ where: { id: { in: userIds } } })
    } finally {
      await prisma.$disconnect()
    }
  })

  function input(overrides: Partial<WorkoutInput> = {}): WorkoutInput {
    return {
      ...workoutFormSchema.parse({
        name: 'Upper body',
        notes: '',
        status: 'DRAFT',
        scheduledDate: '',
        mesocycleId: '',
        exercises: [
          {
            exerciseId: firstExerciseId,
            targetSets: '3',
            targetRepetitions: '10',
            targetWeight: '62.5',
            notes: 'Slow eccentric',
          },
          {
            exerciseId: secondExerciseId,
            targetSets: '1',
            targetRepetitions: '',
            targetWeight: '',
            notes: '',
          },
        ],
      }),
      ...overrides,
    }
  }

  async function createWorkout() {
    const result = await saveWorkoutForUser(ownerId, input())
    if (!('id' in result)) throw new Error(`Could not create fixture: ${result.error}`)
    return result.id
  }

  it('persists ordered targets and returns serializable decimal weights', async () => {
    const id = await createWorkout()
    const detail = await getWorkoutByIdForUser(ownerId, id)
    expect(detail).toMatchObject({
      name: 'Upper body',
      status: 'DRAFT',
      exerciseCount: 2,
      targetSetCount: 4,
      recordedSetCount: 0,
    })
    expect(
      detail?.exercises.map((exercise) => [exercise.exercise.id, exercise.targetWeight])
    ).toEqual([
      [firstExerciseId, 62.5],
      [secondExerciseId, null],
    ])
  })

  it('atomically reorders targets and schedules a workout in an owned mesocycle', async () => {
    const id = await createWorkout()
    const data = input({
      status: 'PLANNED',
      scheduledDate: new Date('2026-12-01T00:00:00.000Z'),
      mesocycleId: cycleId,
    })
    data.exercises.reverse()
    expect(await saveWorkoutForUser(ownerId, data, id)).toEqual({ id })
    const detail = await getWorkoutByIdForUser(ownerId, id)
    expect(detail?.status).toBe('PLANNED')
    expect(detail?.scheduledDate?.toISOString()).toBe('2026-12-01T00:00:00.000Z')
    expect(detail?.mesocycle?.id).toBe(cycleId)
    expect(detail?.exercises.map((exercise) => exercise.exercise.id)).toEqual([
      secondExerciseId,
      firstExerciseId,
    ])
    const rows = await prisma.workoutExercise.findMany({
      where: { workoutId: id },
      orderBy: { order: 'asc' },
    })
    expect(rows.map((row) => row.order)).toEqual([0, 1])
    await saveWorkoutForUser(ownerId, input(), id)
    expect(await getWorkoutByIdForUser(ownerId, id)).toMatchObject({
      status: 'DRAFT',
      scheduledDate: null,
      mesocycle: null,
    })
  })

  it('rejects foreign exercises without changing an existing workout', async () => {
    const id = await createWorkout()
    const invalid = input({ name: 'Should not save' })
    invalid.exercises[0].exerciseId = foreignExerciseId
    expect(await saveWorkoutForUser(ownerId, invalid, id)).toEqual({ error: 'invalid-exercises' })
    expect(await getWorkoutByIdForUser(ownerId, id)).toMatchObject({
      name: 'Upper body',
      exerciseCount: 2,
    })
    expect(await saveWorkoutForUser(ownerId, invalid)).toEqual({ error: 'invalid-exercises' })
  })

  it('rejects a foreign mesocycle', async () => {
    expect(await saveWorkoutForUser(ownerId, input({ mesocycleId: foreignCycleId }))).toEqual({
      error: 'invalid-mesocycle',
    })
  })

  it('hides and refuses changes to another user’s workouts', async () => {
    const id = await createWorkout()
    expect(await getWorkoutByIdForUser(otherId, id)).toBeNull()
    expect(await listWorkoutsForUser(otherId)).toEqual([])
    expect(await saveWorkoutForUser(otherId, input(), id)).toEqual({ error: 'not-found' })
    const options = await getWorkoutFormOptionsForUser(otherId)
    expect(options.exercises.map((exercise) => exercise.id)).toEqual([foreignExerciseId])
    expect(options.mesocycles.map((cycle) => cycle.id)).toEqual([foreignCycleId])
  })

  it.each(['IN_PROGRESS', 'COMPLETED'] as const)(
    'preserves workouts with status %s',
    async (status) => {
      const id = await createWorkout()
      await prisma.workout.update({ where: { id }, data: { status } })
      expect(await saveWorkoutForUser(ownerId, input({ name: 'Changed' }), id)).toEqual({
        error: 'locked',
      })
      expect(await getWorkoutByIdForUser(ownerId, id)).toMatchObject({
        name: 'Upper body',
        status,
        exerciseCount: 2,
      })
    }
  )

  it('preserves recorded sets even if a workout is still marked as a draft', async () => {
    const id = await createWorkout()
    const exercise = await prisma.workoutExercise.findFirstOrThrow({ where: { workoutId: id } })
    const set = await prisma.workoutSet.create({
      data: {
        workoutExerciseId: exercise.id,
        setNumber: 1,
        repetitions: 8,
        weight: 60,
        completed: true,
      },
    })
    expect(await saveWorkoutForUser(ownerId, input(), id)).toEqual({ error: 'locked' })
    expect(await prisma.workoutSet.findUnique({ where: { id: set.id } })).toMatchObject({
      repetitions: 8,
      completed: true,
    })
  })

  it('refuses to replace the plan after startedAt is set', async () => {
    const id = await createWorkout()
    await prisma.workout.update({ where: { id }, data: { startedAt: new Date() } })
    expect(await saveWorkoutForUser(ownerId, input(), id)).toEqual({ error: 'locked' })
  })
})
