import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Register',
}

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-8">
      <section className="mobile-panel w-full max-w-md p-5 text-center">
        <h1 className="text-2xl font-semibold text-zinc-950">Registration is closed</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Repwise is a private application. Users are created through the seed script.
        </p>
        <Link href="/login" className="control-button control-button-primary mt-5">
          Go to login
        </Link>
      </section>
    </main>
  )
}
