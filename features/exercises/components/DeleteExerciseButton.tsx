'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/common'
import { deleteExerciseAction } from '../actions'

type DeleteExerciseButtonProps = {
  exerciseId: string
  exerciseName: string
  className?: string
}

export function DeleteExerciseButton({
  exerciseId,
  exerciseName,
  className,
}: DeleteExerciseButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  return (
    <>
      <button
        type="button"
        className={className ?? 'control-button control-button-secondary text-[var(--danger)]'}
        onClick={() => setConfirmOpen(true)}
        disabled={isPending}
      >
        <Trash2 size={17} aria-hidden="true" />
        <span>{isPending ? 'Deleting...' : 'Delete'}</span>
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete exercise"
        description={`Delete ${exerciseName}? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          startTransition(() => {
            void deleteExerciseAction(exerciseId)
          })
        }}
      />
    </>
  )
}
