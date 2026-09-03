'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

type ErrorStateProps = {
  title?: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Unable to load data',
  description = 'Try again or come back in a moment.',
  retryLabel = 'Retry',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="mobile-panel p-5">
      <div className="flex gap-3">
        <AlertTriangle
          className="mt-0.5 shrink-0 text-[var(--danger)]"
          size={22}
          aria-hidden="true"
        />
        <div>
          <p className="text-base font-semibold text-zinc-950">{title}</p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
        </div>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="control-button control-button-secondary mt-5"
        >
          <RefreshCw size={16} aria-hidden="true" />
          <span>{retryLabel}</span>
        </button>
      ) : null}
    </div>
  )
}
