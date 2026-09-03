import Image from 'next/image'
import { cn } from '@/lib/cn'

type ImagePreviewProps = {
  src?: string | null
  alt: string
  label?: string
  framed?: boolean
}

export function ImagePreview({ src, alt, label, framed = true }: ImagePreviewProps) {
  return (
    <div className={cn('overflow-hidden', framed && 'mobile-panel')}>
      <div className="relative aspect-[4/3] bg-[var(--surface-subtle)]">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-zinc-500">
            No image selected
          </div>
        )}
      </div>
      {label ? (
        <p className="border-t border-[var(--border)] px-4 py-3 text-sm font-medium text-zinc-700">
          {label}
        </p>
      ) : null}
    </div>
  )
}
