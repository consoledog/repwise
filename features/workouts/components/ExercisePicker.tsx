'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { exerciseCategoryOptions } from '@/features/exercises/types'
import type { ExerciseOption } from '../types'

type ExercisePickerProps = {
  exercises: ExerciseOption[]
  selectedIds: string[]
  onAdd: (exercise: ExerciseOption) => void
}

export function ExercisePicker({ exercises, selectedIds, onAdd }: ExercisePickerProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const filtered = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(search.trim().toLowerCase()) &&
      (category === 'ALL' || exercise.category === category)
  )

  return (
    <section aria-labelledby="exercise-picker-heading" className="mobile-panel space-y-4 p-5">
      <div>
        <h2 id="exercise-picker-heading" className="text-lg font-semibold">
          Exercise library
        </h2>
        <p className="mt-1 text-sm text-zinc-600">Add exercises, then set their targets below.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="exercise-search" className="field-label">
            Search exercises
          </label>
          <input
            id="exercise-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="field-input"
            placeholder="Search by name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="exercise-category" className="field-label">
            Category
          </label>
          <select
            id="exercise-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="field-input"
          >
            <option value="ALL">All categories</option>
            {exerciseCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {exercises.length === 0 ? (
        <p className="text-sm leading-6 text-zinc-600">
          Your library is empty.{' '}
          <Link href="/exercises/new" className="font-semibold text-[var(--brand)] underline">
            Create an exercise
          </Link>{' '}
          before building a workout.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-zinc-600">No exercises match these filters.</p>
      ) : (
        <ul className="max-h-80 space-y-2 overflow-y-auto">
          {filtered.map((exercise) => {
            const selected = selectedIds.includes(exercise.id)
            return (
              <li
                key={exercise.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-[var(--surface-subtle)] p-3"
              >
                <div className="min-w-0">
                  <p className="break-words font-semibold">{exercise.name}</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {
                      exerciseCategoryOptions.find((option) => option.value === exercise.category)
                        ?.label
                    }
                  </p>
                </div>
                <button
                  type="button"
                  disabled={selected || selectedIds.length >= 100}
                  onClick={() => onAdd(exercise)}
                  aria-label={`${selected ? 'Added' : 'Add'} ${exercise.name}`}
                  className="control-button control-button-secondary shrink-0 disabled:opacity-50"
                >
                  {!selected && <Plus size={16} aria-hidden="true" />}
                  {selected ? 'Added' : 'Add'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
