import { describe, expect, it, vi } from 'vitest'
import {
  createImagePathname,
  isBlobLikeUrl,
  maxImageSizeBytes,
  validateImageFile,
} from '@/lib/storage/image-validation'

describe('validateImageFile', () => {
  it('accepts supported image files within the size limit', () => {
    const file = new File(['image'], 'bench.png', { type: 'image/png' })

    expect(validateImageFile(file)).toBeNull()
  })

  it('rejects unsupported file types', () => {
    const file = new File(['pdf'], 'notes.pdf', { type: 'application/pdf' })

    expect(validateImageFile(file)).toBe('Use a JPG, PNG, or WebP image.')
  })

  it('rejects oversized image files', () => {
    const file = new File([new Uint8Array(maxImageSizeBytes + 1)], 'large.jpg', {
      type: 'image/jpeg',
    })

    expect(validateImageFile(file)).toBe('Image must be 4 MB or smaller.')
  })
})

describe('createImagePathname', () => {
  it('creates a stable namespace path with a safe extension', () => {
    const randomUUID = vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-id')
    const file = new File(['image'], 'Bench Press.PNG', { type: 'image/png' })

    expect(createImagePathname(file, 'exercise-images')).toBe('exercise-images/bench-press-test-id.png')

    randomUUID.mockRestore()
  })
})

describe('isBlobLikeUrl', () => {
  it('matches public Vercel Blob URLs', () => {
    expect(isBlobLikeUrl('https://abc.public.blob.vercel-storage.com/exercise-images/a.png')).toBe(
      true
    )
  })

  it('rejects unrelated URLs', () => {
    expect(isBlobLikeUrl('https://example.com/image.png')).toBe(false)
  })
})
