import type { z } from 'zod'
import type { loginSchema } from './schemas'

export type LoginFormValues = z.infer<typeof loginSchema>

export type AuthActionResult = {
  error?: string
}
