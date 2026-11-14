'use client'

import { useId } from 'react'
import type { WorkoutExerciseFormValues } from '../types'

type WorkoutSetTargetEditorProps = {
  value: WorkoutExerciseFormValues
  onChange: (value: WorkoutExerciseFormValues) => void
}

export function WorkoutSetTargetEditor({ value, onChange }: WorkoutSetTargetEditorProps) {
  const id = useId()
  const fields = [
    { key: 'targetSets', label: 'Sets', min: 1, max: 100, step: 1, required: true },
    {
      key: 'targetRepetitions',
      label: 'Reps per set',
      min: 1,
      max: 1000,
      step: 1,
      required: false,
    },
    {
      key: 'targetWeight',
      label: 'Weight (kg)',
      min: 0,
      max: 9999.99,
      step: 0.01,
      required: false,
    },
  ] as const

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <label htmlFor={`${id}-${field.key}`} className="field-label">
            {field.label}
          </label>
          <input
            id={`${id}-${field.key}`}
            type="number"
            inputMode={field.key === 'targetWeight' ? 'decimal' : 'numeric'}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
            value={value[field.key]}
            onChange={(event) => onChange({ ...value, [field.key]: event.target.value })}
            className="field-input"
            placeholder={field.required ? undefined : 'Optional'}
          />
        </div>
      ))}
    </div>
  )
}
