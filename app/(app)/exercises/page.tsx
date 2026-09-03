import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/common'

export const metadata: Metadata = {
  title: 'Exercises',
}

export default function ExercisesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Exercise library"
        title="Exercises"
        description="Exercise management will be implemented after the database and auth layers are ready."
      />
      <EmptyState
        title="No exercises yet"
        description="Phase 5 will add exercise creation, editing, filtering, search, descriptions, and optional images."
      />
    </div>
  )
}
