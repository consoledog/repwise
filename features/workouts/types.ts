import type { ExerciseCategory, WorkoutStatus } from '@prisma/client'

export type EditableWorkoutStatus = 'DRAFT' | 'PLANNED'
export const workoutStatusLabels: Record<WorkoutStatus, string> = {
  DRAFT: 'Draft',
  PLANNED: 'Planned',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
}

export type WorkoutExerciseFormValues = {
  exerciseId: string
  targetSets: string
  targetRepetitions: string
  targetWeight: string
  notes: string
}

export type WorkoutFormValues = {
  name: string
  notes: string
  status: EditableWorkoutStatus
  scheduledDate: string
  mesocycleId: string
  exercises: WorkoutExerciseFormValues[]
}

export type WorkoutActionState = { error?: string }
export type WorkoutFormAction = (
  state: WorkoutActionState,
  formData: FormData
) => Promise<WorkoutActionState>
export type ExerciseOption = { id: string; name: string; category: ExerciseCategory }
export type MesocycleOption = { id: string; name: string }
export type WorkoutFormOptions = { exercises: ExerciseOption[]; mesocycles: MesocycleOption[] }

export type WorkoutListItem = {
  id: string
  name: string
  status: WorkoutStatus
  scheduledDate: Date | null
  mesocycle: MesocycleOption | null
  exerciseCount: number
  targetSetCount: number
}

export type WorkoutDetail = WorkoutListItem & {
  notes: string | null
  startedAt: Date | null
  completedAt: Date | null
  recordedSetCount: number
  exercises: Array<{
    id: string
    exercise: ExerciseOption
    targetSets: number | null
    targetRepetitions: number | null
    targetWeight: number | null
    notes: string | null
  }>
}

export function canEditWorkout(
  workout: Pick<WorkoutDetail, 'status' | 'startedAt' | 'recordedSetCount'>
) {
  return (
    (workout.status === 'DRAFT' || workout.status === 'PLANNED') &&
    !workout.startedAt &&
    workout.recordedSetCount === 0
  )
}

export function formatWorkoutDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(date)
    : 'No date set'
}
