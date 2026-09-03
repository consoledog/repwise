import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/common'

export const metadata: Metadata = {
  title: 'New Workout',
}

export default function NewWorkoutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workout builder"
        title="New workout"
        description="The workout builder will be implemented once exercise CRUD and Prisma models exist."
      />
      <EmptyState
        title="Workout builder is not ready"
        description="Phase 7 will add exercise selection, set targets, repetitions, weights, notes, and draft saving."
      />
    </div>
  )
}
