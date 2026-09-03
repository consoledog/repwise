import { describe, expect, it } from 'vitest'
import { exerciseFilterSchema, exerciseFormSchema } from '@/features/exercises/schemas'

describe('exerciseFormSchema', () => {
  it('normalizes valid exercise input', () => {
    const result = exerciseFormSchema.parse({
      name: '  Bench press  ',
      description: '  Barbell press from the bench.  ',
      category: 'ANAEROBIC',
      imageBlobUrl: '',
    })

    expect(result).toEqual({
      name: 'Bench press',
      description: 'Barbell press from the bench.',
      category: 'ANAEROBIC',
      imageBlobUrl: undefined,
    })
  })

  it('rejects invalid image URLs', () => {
    const result = exerciseFormSchema.safeParse({
      name: 'Bench press',
      description: 'Barbell press from the bench.',
      category: 'ANAEROBIC',
      imageBlobUrl: 'not-a-url',
    })

    expect(result.success).toBe(false)
  })
})

describe('exerciseFilterSchema', () => {
  it('defaults invalid filters to broad search', () => {
    const result = exerciseFilterSchema.parse({
      search: '  pull  ',
      category: 'UNKNOWN',
    })

    expect(result).toEqual({
      search: 'pull',
      category: 'ALL',
    })
  })
})
