'use server'

import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { signIn, signOut } from '@/auth'
import { loginSchema } from './schemas'

export async function loginAction(formData: FormData) {
  const parsedCredentials = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsedCredentials.success) {
    redirect('/login?error=invalid-input')
  }

  try {
    await signIn('credentials', {
      email: parsedCredentials.data.email,
      password: parsedCredentials.data.password,
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      redirect('/login?error=invalid-credentials')
    }

    throw error
  }
}

export async function logoutAction() {
  await signOut({
    redirectTo: '/login',
  })
}
