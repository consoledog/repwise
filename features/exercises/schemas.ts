import { z } from 'zod'

export const exerciseCategories = ['ANAEROBIC', 'AEROBIC', 'FLEXIBILITY'] as const

const optionalImageUrlSchema = z
  .string()
  .trim()
  .max(2048, 'Image URL must be shorter than 2048 characters.')
  .transform((value) => value || undefined)
  .pipe(z.url('Enter a valid image URL.').optional())

export const exerciseFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Exercise name must contain at least 2 characters.')
    .max(120, 'Exercise name must be shorter than 120 characters.'),
  description: z
    .string()
    .trim()
    .min(3, 'Description must contain at least 3 characters.')
    .max(2000, 'Description must be shorter than 2000 characters.'),
  category: z.enum(exerciseCategories),
  imageBlobUrl: optionalImageUrlSchema,
})

export const exerciseIdSchema = z.string().trim().min(1)

export const exerciseFilterSchema = z.object({
  search: z.string().trim().max(120).catch(''),
  category: z
    .union([z.enum(exerciseCategories), z.literal('ALL')])
    .catch('ALL'),
})

export type ExerciseFormInput = z.infer<typeof exerciseFormSchema>
