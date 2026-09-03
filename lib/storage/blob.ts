import 'server-only'
import { del } from '@vercel/blob'
import { isBlobLikeUrl } from './image-validation'

export async function deleteBlobIfManaged(url: string | null | undefined) {
  if (!url || !isBlobLikeUrl(url)) {
    return
  }

  await del(url)
}

export async function deleteBlobIfManagedQuietly(url: string | null | undefined) {
  try {
    await deleteBlobIfManaged(url)
  } catch (error) {
    console.error('Failed to delete blob', error)
  }
}
