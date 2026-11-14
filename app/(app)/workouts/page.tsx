import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { getCurrentUserOrThrow } from '@/lib/auth/guards'
import { listWorkoutsForUser } from '@/features/workouts/queries'
import { WorkoutList } from '@/features/workouts/components'

export const metadata: Metadata = {
  title: 'Workouts',
}

export default async function WorkoutsPage() {
  const user = await getCurrentUserOrThrow()
  const workouts = await listWorkoutsForUser(user.id)
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workout tracking"
        title="Workouts"
        description="Plan your sessions, set exercise targets, and organize your workouts."
        actions={
          <Link href="/workouts/new" className="control-button control-button-primary">
            <Plus size={18} aria-hidden="true" />
            <span>New workout</span>
          </Link>
        }
      />
      <WorkoutList workouts={workouts} />
    </div>
  )
}
