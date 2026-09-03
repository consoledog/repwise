'use client'

import { upload } from '@vercel/blob/client'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ImagePreview } from '@/components/common'
import { compressImageFile } from '@/lib/storage/client-image-compression'
import { createImagePathname, validateImageFile } from '@/lib/storage/image-validation'

type ExerciseImageFieldProps = {
  defaultValue?: string | null
  onUploadStateChange?: (isUploading: boolean) => void
}

export function ExerciseImageField({ defaultValue, onUploadStateChange }: ExerciseImageFieldProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue ?? '')
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const previewUrl = localPreviewUrl ?? imageUrl

  useEffect(() => {
    onUploadStateChange?.(isUploading)
  }, [isUploading, onUploadStateChange])

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl)
      }
    }
  }, [localPreviewUrl])

  function replaceLocalPreview(nextPreviewUrl: string | null) {
    setLocalPreviewUrl((previousPreviewUrl) => {
      if (previousPreviewUrl) {
        URL.revokeObjectURL(previousPreviewUrl)
      }

      return nextPreviewUrl
    })
  }

  async function uploadFile(file: File) {
    const validationError = validateImageFile(file)

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setErrorMessage(null)
    setUploadProgress(0)
    setIsUploading(true)
    replaceLocalPreview(URL.createObjectURL(file))

    try {
      const compressedFile = await compressImageFile(file)
      const blob = await upload(createImagePathname(compressedFile, 'exercise-images'), compressedFile, {
        access: 'public',
        handleUploadUrl: '/api/uploads',
        clientPayload: JSON.stringify({ kind: 'exercise-image' }),
        contentType: compressedFile.type,
        onUploadProgress: ({ percentage }) => setUploadProgress(percentage),
      })

      setImageUrl(blob.url)
      replaceLocalPreview(null)
      setUploadProgress(null)
    } catch (error) {
      setUploadProgress(null)
      setErrorMessage(error instanceof Error ? error.message : 'Image upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_16rem]">
      <div className="space-y-2">
        <label htmlFor="exerciseImageFile" className="field-label">
          Image
        </label>
        <input id="imageBlobUrl" name="imageBlobUrl" type="hidden" value={imageUrl} />
        <input
          id="exerciseImageFile"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="field-input"
          disabled={isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0]

            if (!file) {
              return
            }

            void uploadFile(file)
          }}
        />
        {uploadProgress !== null ? (
          <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-subtle)]">
            <div
              className="h-full bg-[var(--brand)] transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        ) : null}
        {errorMessage ? (
          <p className="text-xs font-medium text-[var(--danger)]">{errorMessage}</p>
        ) : null}
        {imageUrl ? (
          <button
            type="button"
            className="control-button control-button-secondary text-[var(--danger)]"
            disabled={isUploading}
            onClick={() => {
              setImageUrl('')
              replaceLocalPreview(null)
              setErrorMessage(null)
              setUploadProgress(null)
            }}
          >
            <Trash2 size={17} aria-hidden="true" />
            <span>Remove image</span>
          </button>
        ) : null}
      </div>

      <div className="rounded-lg border border-[var(--border)]">
        <ImagePreview src={previewUrl} alt="Exercise preview" label="Preview" framed={false} />
      </div>
    </div>
  )
}
