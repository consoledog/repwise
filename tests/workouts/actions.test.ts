import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  save: vi.fn(),
  revalidate: vi.fn(),
  redirect: vi.fn((path: string): never => {
    throw new Error(`redirect:${path}`)
  }),
  notFound: vi.fn((): never => {
    throw new Error('not-found')
  }),
}))
vi.mock('@/lib/auth/guards', () => ({ getCurrentUserOrThrow: mocks.getUser }))
vi.mock('@/features/workouts/mutations', () => ({ saveWorkoutForUser: mocks.save }))
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidate }))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect, notFound: mocks.notFound }))

import { createWorkoutAction, updateWorkoutAction } from '@/features/workouts/actions'

function form() {
  const data = new FormData()
  data.set('name', 'Upper body')
  data.set('status', 'DRAFT')
  data.set(
    'exercises',
    JSON.stringify([
      {
        exerciseId: 'bench',
        targetSets: '3',
        targetRepetitions: '10',
        targetWeight: '',
        notes: '',
      },
    ])
  )
  return data
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.getUser.mockResolvedValue({ id: 'authenticated-user' })
  mocks.save.mockResolvedValue({ id: 'saved-workout' })
})

describe('workout server actions', () => {
  it('requires authentication for both creation and editing', async () => {
    mocks.getUser.mockRejectedValue(new Error('Unauthenticated'))
    await expect(createWorkoutAction({}, form())).rejects.toThrow('Unauthenticated')
    await expect(updateWorkoutAction('workout', {}, form())).rejects.toThrow('Unauthenticated')
    expect(mocks.save).not.toHaveBeenCalled()
  })

  it('rejects client attempts to complete a workout through the planning form', async () => {
    const data = form()
    data.set('status', 'COMPLETED')
    expect(await createWorkoutAction({}, data)).toHaveProperty('error')
    expect(mocks.save).not.toHaveBeenCalled()
  })

  it('uses the authenticated owner, ignoring a submitted userId', async () => {
    const data = form()
    data.set('userId', 'another-user')
    await expect(createWorkoutAction({}, data)).rejects.toThrow('redirect:/workouts/saved-workout')
    expect(mocks.save).toHaveBeenCalledWith(
      'authenticated-user',
      expect.objectContaining({ name: 'Upper body' }),
      undefined
    )
    expect(mocks.revalidate).toHaveBeenCalledWith('/workouts')
  })

  it('returns a recoverable error on a concurrent change', async () => {
    mocks.save.mockRejectedValue({ code: 'P2034' })
    expect(await updateWorkoutAction('workout', {}, form())).toEqual({
      error: expect.stringContaining('changed while saving'),
    })
    expect(mocks.redirect).not.toHaveBeenCalled()
  })

  it('does not disclose a workout belonging to another account', async () => {
    mocks.save.mockResolvedValue({ error: 'not-found' })
    await expect(updateWorkoutAction('foreign-workout', {}, form())).rejects.toThrow('not-found')
    expect(mocks.revalidate).not.toHaveBeenCalled()
  })
})
