import type { ExerciseCategory, ExerciseSource } from '@prisma/client'

export const exerciseCategoryOptions: Array<{
  value: ExerciseCategory
  label: string
  description: string
}> = [
  {
    value: 'ANAEROBIC',
    label: 'Anaerobic',
    description: 'Strength, resistance, and hypertrophy work.',
  },
  {
    value: 'AEROBIC',
    label: 'Aerobic',
    description: 'Conditioning, cardio, and endurance work.',
  },
  {
    value: 'FLEXIBILITY',
    label: 'Flexibility',
    description: 'Mobility, stretching, and range-of-motion work.',
  },
]

export const exerciseSourceLabels: Record<ExerciseSource, string> = {
  MANUAL: 'Manual',
  EXTERNAL: 'External',
}

export type ExerciseFilters = {
  search: string
  category: ExerciseCategory | 'ALL'
}

export type ExerciseFormValues = {
  name: string
  description: string
  category: ExerciseCategory
  imageBlobUrl: string
}

export type ExerciseListItem = {
  id: string
  name: string
  description: string
  category: ExerciseCategory
  imageBlobUrl: string | null
  source: ExerciseSource
  updatedAt: Date
  workoutUsageCount: number
}

export type ExerciseDetail = ExerciseListItem & {
  createdAt: Date
  externalSourceId: string | null
}
