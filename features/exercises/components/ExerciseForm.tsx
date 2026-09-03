'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Save } from 'lucide-react'
import { exerciseCategoryOptions, type ExerciseFormValues } from '../types'
import { ExerciseImageField } from './ExerciseImageField'

type ExerciseFormProps = {
  action: (formData: FormData) => void | Promise<void>
  mode: 'create' | 'edit'
  defaultValues?: Partial<ExerciseFormValues>
  errorMessage?: string
  cancelHref?: string
}

const emptyValues: ExerciseFormValues = {
  name: '',
  description: '',
  category: 'ANAEROBIC',
  imageBlobUrl: '',
}

export function ExerciseForm({
  action,
  mode,
  defaultValues,
  errorMessage,
  cancelHref = '/exercises',
}: ExerciseFormProps) {
  const values = {
    ...emptyValues,
    ...defaultValues,
  }
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  return (
    <form action={action} className="mobile-panel space-y-5 p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="field-label">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            defaultValue={values.name}
            className="field-input"
            placeholder="Bench press"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="field-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={values.category}
            className="field-input"
          >
            {exerciseCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="field-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={3}
          maxLength={2000}
          defaultValue={values.description}
          className="field-input min-h-36 resize-y"
          placeholder="Setup, execution cues, range of motion, and notes."
        />
      </div>

      <ExerciseImageField
        defaultValue={values.imageBlobUrl}
        onUploadStateChange={setIsUploadingImage}
      />

      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href={cancelHref} className="control-button control-button-secondary">
          Cancel
        </Link>
        <button
          type="submit"
          className="control-button control-button-primary"
          disabled={isUploadingImage}
        >
          <Save size={17} aria-hidden="true" />
          <span>
            {isUploadingImage
              ? 'Uploading...'
              : mode === 'create'
                ? 'Create exercise'
                : 'Save changes'}
          </span>
        </button>
      </div>
    </form>
  )
}
