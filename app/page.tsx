export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-between">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              Workout tracking
            </p>
            <h1 className="text-4xl font-semibold text-zinc-950">Repwise</h1>
            <p className="text-base leading-7 text-zinc-650">
              A private training log for exercises, workouts, sets, weights, mesocycles, and
              progress photos.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-zinc-950">Exercise database</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Create your own exercise library and reuse it when building workouts.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-zinc-950">Workout tracking</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Record sets, repetitions, and weight from your phone while training.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-zinc-950">Mesocycles</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Group workouts into training blocks and compare before and after photos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
