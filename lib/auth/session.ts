import 'server-only'
import { auth } from '@/auth'

export async function getSession() {
  return auth()
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.id || !session.user.email) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
  }
}
