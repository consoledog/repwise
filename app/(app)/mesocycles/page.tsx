import type { Metadata } from 'next'
import { EmptyState } from '@/components/common'
import { PageHeader } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Mesocycles',
}

export default function MesocyclesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Training blocks"
        title="Mesocycles"
        description="Mesocycle planning will group workouts into longer training blocks."
      />
      <EmptyState
        title="No mesocycles yet"
        description="Phase 9 will add planned workout count, progress tracking, completion status, and notes."
      />
    </div>
  )
}
