'use client'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-8">
      <section className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-red-700">Error</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-950">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          {error.message || 'The application could not render this screen.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white"
        >
          Try again
        </button>
      </section>
    </main>
  )
}
