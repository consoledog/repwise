import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { EmptyState } from '@/components/common'
import { PageHeader } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Workouts',
}

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workout tracking"
        title="Workouts"
        description="Workout creation and history will be connected after exercises and database storage are ready."
        actions={
          <Link href="/workouts/new" className="control-button control-button-primary">
            <Plus size={18} aria-hidden="true" />
            <span>New workout</span>
          </Link>
        }
      />
      <EmptyState
        title="No workouts yet"
        description="Phase 7 will add workout creation from existing exercises, target sets, repetitions, and weights."
      />
    </div>
  )
}
