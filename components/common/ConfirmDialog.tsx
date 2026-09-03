'use client'

import { AlertTriangle } from 'lucide-react'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/45 p-4 sm:items-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
      >
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[var(--danger)]">
            <AlertTriangle size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 id="confirm-dialog-title" className="text-lg font-semibold text-zinc-950">
              {title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="control-button control-button-secondary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="control-button text-white"
            style={{ background: destructive ? 'var(--danger)' : 'var(--foreground)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
