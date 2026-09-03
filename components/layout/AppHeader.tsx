import Link from 'next/link'
import { Dumbbell, LogOut, Plus } from 'lucide-react'
import { logoutAction } from '@/features/auth/actions'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgb(247_248_245_/_0.9)] backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--foreground)] text-white">
            <Dumbbell size={20} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-semibold leading-5 text-zinc-950">Repwise</span>
            <span className="block truncate text-xs font-medium leading-5 text-zinc-600">
              Training log
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/workouts/new" className="control-button control-button-primary">
            <Plus size={18} aria-hidden="true" />
            <span>New workout</span>
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="control-button control-button-secondary"
              aria-label="Sign out"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
