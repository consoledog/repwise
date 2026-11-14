import { z } from 'zod'

export const editableWorkoutStatuses = ['DRAFT', 'PLANNED'] as const
export const workoutIdSchema = z.string().trim().min(1).max(128)

const optionalText = z
  .string()
  .trim()
  .max(2000)
  .transform((value) => value || null)
const optionalId = z.union([workoutIdSchema, z.literal('')]).transform((value) => value || null)

const scheduledDateSchema = z
  .string()
  .refine((value) => {
    if (!value) return true
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) return false
    const date = new Date(`${value}T00:00:00.000Z`)
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  }, 'Enter a valid workout date.')
  .transform((value) => (value ? new Date(`${value}T00:00:00.000Z`) : null))

function numericInput(value: unknown) {
  if (value === '' || value === null || value === undefined) return null
  if (typeof value === 'string' && value.trim() !== '') return Number(value)
  return value
}

export const workoutExerciseSchema = z.object({
  exerciseId: workoutIdSchema,
  targetSets: z.preprocess(numericInput, z.number().int().min(1).max(100)),
  targetRepetitions: z.preprocess(numericInput, z.number().int().min(1).max(1000).nullable()),
  targetWeight: z.preprocess(
    numericInput,
    z
      .number()
      .min(0)
      .max(9999.99)
      .refine(
        (value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
        'Weight can have at most two decimal places.'
      )
      .nullable()
  ),
  notes: optionalText,
})

export const workoutFormSchema = z
  .object({
    name: z.string().trim().min(2, 'Workout name must contain at least 2 characters.').max(120),
    notes: optionalText,
    status: z.enum(editableWorkoutStatuses),
    scheduledDate: scheduledDateSchema,
    mesocycleId: optionalId,
    exercises: z.array(workoutExerciseSchema).min(1, 'Add at least one exercise.').max(100),
  })
  .superRefine((value, context) => {
    if (value.status === 'PLANNED' && !value.scheduledDate) {
      context.addIssue({
        code: 'custom',
        path: ['scheduledDate'],
        message: 'Choose a date for a planned workout.',
      })
    }
    const ids = value.exercises.map((exercise) => exercise.exerciseId)
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: 'custom',
        path: ['exercises'],
        message: 'Each exercise can only be added once.',
      })
    }
  })

export function parseWorkoutForm(formData: FormData) {
  let exercises: unknown
  try {
    const raw = formData.get('exercises')
    exercises = typeof raw === 'string' && raw.length <= 300000 ? JSON.parse(raw) : null
  } catch {
    exercises = null
  }
  return workoutFormSchema.safeParse({
    name: formData.get('name'),
    notes: formData.get('notes') ?? '',
    status: formData.get('status'),
    scheduledDate: formData.get('scheduledDate') ?? '',
    mesocycleId: formData.get('mesocycleId') ?? '',
    exercises,
  })
}

export type WorkoutInput = z.infer<typeof workoutFormSchema>
