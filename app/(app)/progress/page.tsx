import type { Metadata } from 'next'
import { EmptyState } from '@/components/common'
import { PageHeader } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Progress Photos',
}

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Progress"
        title="Progress photos"
        description="Before and after photos will be attached to mesocycles after uploads are implemented."
      />
      <EmptyState
        title="No photos yet"
        description="Phase 10 will add before and after uploads, previews, deletion, and comparison."
      />
    </div>
  )
}
