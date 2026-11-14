'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Save } from 'lucide-react'
import type {
  ExerciseOption,
  WorkoutFormAction,
  WorkoutFormOptions,
  WorkoutFormValues,
} from '../types'
import { ExercisePicker } from './ExercisePicker'
import { WorkoutExerciseEditor } from './WorkoutExerciseEditor'

type WorkoutFormProps = {
  action: WorkoutFormAction
  options: WorkoutFormOptions
  defaultValues?: WorkoutFormValues
  cancelHref?: string
}

const emptyValues: WorkoutFormValues = {
  name: '',
  notes: '',
  scheduledDate: '',
  mesocycleId: '',
  status: 'DRAFT',
  exercises: [],
}

export function WorkoutForm({
  action,
  options,
  defaultValues,
  cancelHref = '/workouts',
}: WorkoutFormProps) {
  const [values, setValues] = useState<WorkoutFormValues>(defaultValues ?? emptyValues)
  const [state, formAction, pending] = useActionState(action, {})
  const exerciseOptions = new Map(options.exercises.map((exercise) => [exercise.id, exercise]))

  function addExercise(exercise: ExerciseOption) {
    setValues((current) => {
      if (
        current.exercises.some((item) => item.exerciseId === exercise.id) ||
        current.exercises.length >= 100
      )
        return current
      return {
        ...current,
        exercises: [
          ...current.exercises,
          {
            exerciseId: exercise.id,
            targetSets: '3',
            targetRepetitions: '10',
            targetWeight: '',
            notes: '',
          },
        ],
      }
    })
  }

  function moveExercise(index: number, direction: -1 | 1) {
    setValues((current) => {
      const next = index + direction
      if (next < 0 || next >= current.exercises.length) return current
      const exercises = [...current.exercises]
      ;[exercises[index], exercises[next]] = [exercises[next], exercises[index]]
      return { ...current, exercises }
    })
  }

  return (
    <form action={formAction} className="space-y-5" aria-busy={pending}>
      <input type="hidden" name="exercises" value={JSON.stringify(values.exercises)} />
      <fieldset disabled={pending} className="min-w-0 space-y-5 disabled:opacity-70">
        <legend className="sr-only">Workout details and exercises</legend>
        <section className="mobile-panel space-y-4 p-5" aria-labelledby="workout-details-heading">
          <h2 id="workout-details-heading" className="text-lg font-semibold">
            Workout details
          </h2>
          <div className="space-y-2">
            <label htmlFor="workout-name" className="field-label">
              Name
            </label>
            <input
              id="workout-name"
              name="name"
              value={values.name}
              onChange={(event) => setValues({ ...values, name: event.target.value })}
              required
              minLength={2}
              maxLength={120}
              className="field-input"
              placeholder="Upper body A"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="workout-status" className="field-label">
                Status
              </label>
              <select
                id="workout-status"
                name="status"
                value={values.status}
                onChange={(event) =>
                  setValues({
                    ...values,
                    status: event.target.value === 'PLANNED' ? 'PLANNED' : 'DRAFT',
                  })
                }
                className="field-input"
              >
                <option value="DRAFT">Draft</option>
                <option value="PLANNED">Planned</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="workout-date" className="field-label">
                Scheduled date{' '}
                {values.status === 'DRAFT' && (
                  <span className="font-normal text-zinc-500">(optional)</span>
                )}
              </label>
              <input
                id="workout-date"
                name="scheduledDate"
                type="date"
                value={values.scheduledDate}
                onChange={(event) => setValues({ ...values, scheduledDate: event.target.value })}
                required={values.status === 'PLANNED'}
                className="field-input"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="workout-mesocycle" className="field-label">
              Mesocycle <span className="font-normal text-zinc-500">(optional)</span>
            </label>
            <select
              id="workout-mesocycle"
              name="mesocycleId"
              value={values.mesocycleId}
              onChange={(event) => setValues({ ...values, mesocycleId: event.target.value })}
              className="field-input"
            >
              <option value="">No mesocycle</option>
              {options.mesocycles.map((mesocycle) => (
                <option key={mesocycle.id} value={mesocycle.id}>
                  {mesocycle.name}
                </option>
              ))}
            </select>
            {options.mesocycles.length === 0 && (
              <p className="text-sm text-zinc-500">
                No mesocycles yet. You can assign this workout later.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="workout-notes" className="field-label">
              Workout notes <span className="font-normal text-zinc-500">(optional)</span>
            </label>
            <textarea
              id="workout-notes"
              name="notes"
              value={values.notes}
              onChange={(event) => setValues({ ...values, notes: event.target.value })}
              maxLength={2000}
              rows={3}
              className="field-input resize-y"
              placeholder="Goals or reminders for this session"
            />
          </div>
        </section>

        <ExercisePicker
          exercises={options.exercises}
          selectedIds={values.exercises.map((exercise) => exercise.exerciseId)}
          onAdd={addExercise}
        />

        <section aria-labelledby="workout-exercises-heading" className="space-y-3">
          <div>
            <h2 id="workout-exercises-heading" className="text-lg font-semibold">
              Workout exercises ({values.exercises.length})
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Targets apply to each set. Reps and weight are optional for cardio and mobility
              exercises.
            </p>
          </div>
          {values.exercises.length === 0 ? (
            <p className="mobile-panel p-5 text-sm text-zinc-600">
              Choose at least one exercise from your library.
            </p>
          ) : (
            <ol className="space-y-3">
              {values.exercises.map((value, index) => {
                const exercise = exerciseOptions.get(value.exerciseId)
                if (!exercise)
                  return (
                    <li key={value.exerciseId} role="alert">
                      This exercise is no longer available. Reload the page.
                    </li>
                  )
                return (
                  <WorkoutExerciseEditor
                    key={value.exerciseId}
                    exercise={exercise}
                    value={value}
                    index={index}
                    total={values.exercises.length}
                    onChange={(updated) =>
                      setValues((current) => ({
                        ...current,
                        exercises: current.exercises.map((item, itemIndex) =>
                          itemIndex === index ? updated : item
                        ),
                      }))
                    }
                    onMove={(direction) => moveExercise(index, direction)}
                    onRemove={() =>
                      setValues((current) => ({
                        ...current,
                        exercises: current.exercises.filter(
                          (item) => item.exerciseId !== value.exerciseId
                        ),
                      }))
                    }
                  />
                )
              })}
            </ol>
          )}
        </section>
      </fieldset>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {state.error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href={cancelHref} className="control-button control-button-secondary">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending || values.exercises.length === 0}
          className="control-button control-button-primary disabled:opacity-50"
        >
          <Save size={17} aria-hidden="true" />
          {pending
            ? 'Saving...'
            : defaultValues
              ? 'Save changes'
              : values.status === 'DRAFT'
                ? 'Save draft'
                : 'Schedule workout'}
        </button>
      </div>
    </form>
  )
}
