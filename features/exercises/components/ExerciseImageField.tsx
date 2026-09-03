'use client'

import { useState } from 'react'
import { ImagePreview } from '@/components/common'

type ExerciseImageFieldProps = {
  defaultValue?: string | null
}

export function ExerciseImageField({ defaultValue }: ExerciseImageFieldProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue ?? '')
  const previewUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://') ? imageUrl : null

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_16rem]">
      <div className="space-y-2">
        <label htmlFor="imageBlobUrl" className="field-label">
          Image URL
        </label>
        <input
          id="imageBlobUrl"
          name="imageBlobUrl"
          type="url"
          inputMode="url"
          defaultValue={defaultValue ?? ''}
          onChange={(event) => setImageUrl(event.target.value)}
          className="field-input"
          placeholder="https://example.com/exercise.jpg"
        />
        <p className="text-xs leading-5 text-zinc-500">
          Optional for now. File upload will be added in the storage phase.
        </p>
      </div>

      <div className="rounded-lg border border-[var(--border)]">
        <ImagePreview src={previewUrl} alt="Exercise preview" label="Preview" framed={false} />
      </div>
    </div>
  )
}
