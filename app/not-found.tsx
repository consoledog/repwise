import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-8">
      <section className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-emerald-700">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-950">Page not found</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          The page you requested does not exist.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </section>
    </main>
  )
}
