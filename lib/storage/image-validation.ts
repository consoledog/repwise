export const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'] as const

export const maxImageSizeBytes = 4 * 1024 * 1024

export type AllowedImageType = (typeof allowedImageTypes)[number]

const extensionByMimeType: Record<AllowedImageType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function isAllowedImageType(type: string): type is AllowedImageType {
  return allowedImageTypes.includes(type as AllowedImageType)
}

export function validateImageFile(file: File) {
  if (!isAllowedImageType(file.type)) {
    return 'Use a JPG, PNG, or WebP image.'
  }

  if (file.size > maxImageSizeBytes) {
    return 'Image must be 4 MB or smaller.'
  }

  return null
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export function createImagePathname(file: File, namespace: 'exercise-images' | 'progress-photos') {
  const extension = isAllowedImageType(file.type)
    ? extensionByMimeType[file.type]
    : file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const baseName = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image'

  return `${namespace}/${baseName}-${crypto.randomUUID()}.${extension}`
}

export function isBlobLikeUrl(value: string | null | undefined) {
  if (!value) {
    return false
  }

  try {
    const url = new URL(value)

    return url.protocol === 'https:' && url.hostname.endsWith('.public.blob.vercel-storage.com')
  } catch {
    return false
  }
}
