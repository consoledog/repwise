import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout'
import { getCurrentUserOrThrow } from '@/lib/auth/guards'
import { createWorkoutAction } from '@/features/workouts/actions'
import { WorkoutForm } from '@/features/workouts/components'
import { getWorkoutFormOptionsForUser } from '@/features/workouts/queries'

export const metadata: Metadata = {
  title: 'New Workout',
}

export default async function NewWorkoutPage() {
  const user = await getCurrentUserOrThrow()
  const options = await getWorkoutFormOptionsForUser(user.id)
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workout builder"
        title="New workout"
        description="Choose exercises and targets, then save a draft or schedule your session."
      />
      <WorkoutForm action={createWorkoutAction} options={options} />
    </div>
  )
}
