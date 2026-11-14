import { describe, expect, it } from 'vitest'
import { parseWorkoutForm, workoutFormSchema } from '@/features/workouts/schemas'

const exercise = {
  exerciseId: 'exercise-1',
  targetSets: '3',
  targetRepetitions: '10',
  targetWeight: '62.50',
  notes: '',
}
const draft = {
  name: '  Upper body  ',
  notes: '',
  status: 'DRAFT',
  scheduledDate: '',
  mesocycleId: '',
  exercises: [exercise],
}

describe('workout form validation', () => {
  it('normalizes a draft without treating an empty optional weight as zero', () => {
    const result = workoutFormSchema.parse({
      ...draft,
      exercises: [{ ...exercise, targetWeight: '', targetRepetitions: '' }],
    })
    expect(result).toMatchObject({
      name: 'Upper body',
      notes: null,
      scheduledDate: null,
      mesocycleId: null,
      exercises: [{ targetSets: 3, targetWeight: null, targetRepetitions: null, notes: null }],
    })
  })

  it('preserves a zero weight and decimal weights', () => {
    expect(workoutFormSchema.parse(draft).exercises[0].targetWeight).toBe(62.5)
    expect(
      workoutFormSchema.parse({ ...draft, exercises: [{ ...exercise, targetWeight: '0' }] })
        .exercises[0].targetWeight
    ).toBe(0)
  })

  it('requires a real calendar date for a planned workout', () => {
    for (const date of ['', '0000-01-01', '2026-02-29', '2026-02-30', '2026-13-01', 'invalid']) {
      expect(
        workoutFormSchema.safeParse({ ...draft, status: 'PLANNED', scheduledDate: date }).success
      ).toBe(false)
    }
    expect(
      workoutFormSchema
        .parse({ ...draft, status: 'PLANNED', scheduledDate: '2028-02-29' })
        .scheduledDate?.toISOString()
    ).toBe('2028-02-29T00:00:00.000Z')
  })

  it.each([
    { targetSets: '' },
    { targetSets: '0' },
    { targetSets: '1.5' },
    { targetSets: '101' },
    { targetRepetitions: '-1' },
    { targetRepetitions: '0' },
    { targetRepetitions: '2.5' },
    { targetWeight: '-1' },
    { targetWeight: '12.345' },
    { targetWeight: '10000' },
    { targetWeight: 'Infinity' },
    { targetWeight: true },
  ])('rejects invalid targets: %j', (override) => {
    expect(
      workoutFormSchema.safeParse({ ...draft, exercises: [{ ...exercise, ...override }] }).success
    ).toBe(false)
  })

  it('rejects empty or duplicate exercises and status escalation', () => {
    expect(workoutFormSchema.safeParse({ ...draft, exercises: [] }).success).toBe(false)
    expect(workoutFormSchema.safeParse({ ...draft, exercises: [exercise, exercise] }).success).toBe(
      false
    )
    expect(workoutFormSchema.safeParse({ ...draft, status: 'COMPLETED' }).success).toBe(false)
  })

  it('rejects malformed exercise payloads without throwing', () => {
    const form = new FormData()
    form.set('exercises', '{broken-json')
    expect(parseWorkoutForm(form).success).toBe(false)
  })
})
