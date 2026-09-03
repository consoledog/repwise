import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Dumbbell } from 'lucide-react'
import { auth } from '@/auth'
import { LoginForm } from '@/features/auth/components'

export const metadata: Metadata = {
  title: 'Login',
}

const errorMessages: Record<string, string> = {
  'invalid-input': 'Enter a valid email and a password with at least 8 characters.',
  'invalid-credentials': 'Email or password is incorrect.',
}

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth()

  if (session?.user) {
    redirect('/dashboard')
  }

  const params = await searchParams
  const errorMessage = params?.error ? errorMessages[params.error] : undefined

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-8">
      <section className="w-full max-w-md space-y-6">
        <div className="space-y-3 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-[var(--foreground)] text-white">
            <Dumbbell size={24} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold text-zinc-950">Sign in to Repwise</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Access is limited to the private users configured for this app.
            </p>
          </div>
        </div>

        <LoginForm errorMessage={errorMessage} />
      </section>
    </main>
  )
}
