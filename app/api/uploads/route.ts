import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { allowedImageTypes, maxImageSizeBytes } from '@/lib/storage/image-validation'

export const runtime = 'nodejs'

type UploadClientPayload = {
  kind?: 'exercise-image' | 'progress-photo'
}

function parseClientPayload(clientPayload: string | null): UploadClientPayload {
  if (!clientPayload) {
    return {}
  }

  try {
    return JSON.parse(clientPayload) as UploadClientPayload
  } catch {
    return {}
  }
}

function isAllowedPathname(pathname: string) {
  return pathname.startsWith('exercise-images/') || pathname.startsWith('progress-photos/')
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Blob storage is not configured.' }, { status: 503 })
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = parseClientPayload(clientPayload)

        if (!isAllowedPathname(pathname)) {
          throw new Error('Invalid upload path.')
        }

        if (!payload.kind) {
          throw new Error('Invalid upload payload.')
        }

        return {
          allowedContentTypes: [...allowedImageTypes],
          maximumSizeInBytes: maxImageSizeBytes,
          addRandomSuffix: false,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({
            kind: payload.kind,
            userId: user.id,
          }),
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.info(`Blob upload completed: ${blob.pathname}`)
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed.'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
