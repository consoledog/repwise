import 'server-only'
import { redirect } from 'next/navigation'
import { getCurrentUser } from './session'

export async function getCurrentUserOrThrow() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthenticated')
  }

  return user
}

export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}
