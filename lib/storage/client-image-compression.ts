'use client'

import { maxImageSizeBytes } from './image-validation'

const maxDimension = 1600
const webpQuality = 0.82

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not read selected image.'))
    }
    image.src = objectUrl
  })
}

function calculateSize(width: number, height: number) {
  const longestSide = Math.max(width, height)

  if (longestSide <= maxDimension) {
    return { width, height }
  }

  const ratio = maxDimension / longestSide

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}

export async function compressImageFile(file: File) {
  const image = await loadImage(file)
  const canvas = document.createElement('canvas')
  const size = calculateSize(image.naturalWidth, image.naturalHeight)

  canvas.width = size.width
  canvas.height = size.height

  const context = canvas.getContext('2d')

  if (!context) {
    return file
  }

  context.drawImage(image, 0, 0, size.width, size.height)

  const compressedBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', webpQuality)
  })

  if (!compressedBlob || compressedBlob.size >= file.size || compressedBlob.size > maxImageSizeBytes) {
    return file
  }

  return new File([compressedBlob], file.name.replace(/\.[^.]+$/, '.webp'), {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}
