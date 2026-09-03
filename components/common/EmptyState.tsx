import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="mobile-panel flex min-h-52 flex-col items-center justify-center p-6 text-center">
      <span className="flex size-12 items-center justify-center rounded-lg bg-[var(--surface-subtle)] text-zinc-600">
        <Inbox size={22} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-zinc-950">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
