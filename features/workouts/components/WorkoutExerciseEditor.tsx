'use client'

import { useId } from 'react'
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import type { ExerciseOption, WorkoutExerciseFormValues } from '../types'
import { WorkoutSetTargetEditor } from './WorkoutSetTargetEditor'

type WorkoutExerciseEditorProps = {
  exercise: ExerciseOption
  value: WorkoutExerciseFormValues
  index: number
  total: number
  onChange: (value: WorkoutExerciseFormValues) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}

export function WorkoutExerciseEditor({
  exercise,
  value,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: WorkoutExerciseEditorProps) {
  const notesId = useId()
  return (
    <li className="mobile-panel space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="break-words font-semibold">
          {index + 1}. {exercise.name}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label={`Move ${exercise.name} up`}
            className="control-button control-button-secondary disabled:opacity-40"
          >
            <ArrowUp size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label={`Move ${exercise.name} down`}
            className="control-button control-button-secondary disabled:opacity-40"
          >
            <ArrowDown size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${exercise.name}`}
            className="control-button control-button-secondary text-[var(--danger)]"
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
      <WorkoutSetTargetEditor value={value} onChange={onChange} />
      <div className="space-y-2">
        <label htmlFor={notesId} className="field-label">
          Exercise notes <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <textarea
          id={notesId}
          value={value.notes}
          onChange={(event) => onChange({ ...value, notes: event.target.value })}
          maxLength={2000}
          rows={2}
          className="field-input resize-y"
          placeholder="Rest time, tempo, or setup cues"
        />
      </div>
    </li>
  )
}
