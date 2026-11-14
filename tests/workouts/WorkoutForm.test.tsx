import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { WorkoutForm } from '@/features/workouts/components/WorkoutForm'
import type { WorkoutFormAction, WorkoutFormOptions } from '@/features/workouts/types'

afterEach(cleanup)
const options: WorkoutFormOptions = {
  exercises: [
    { id: 'bench', name: 'Bench press', category: 'ANAEROBIC' },
    { id: 'run', name: 'Running', category: 'AEROBIC' },
  ],
  mesocycles: [{ id: 'cycle', name: 'Winter block' }],
}

describe('workout builder', () => {
  it('saves reordered exercises with their own targets and retains the form after a server error', async () => {
    const user = userEvent.setup()
    const action = vi.fn<WorkoutFormAction>(async () => ({
      error: 'Exercise library changed.',
    }))
    render(<WorkoutForm action={action} options={options} />)
    await user.type(screen.getByLabelText('Name'), 'Upper body')
    await user.click(screen.getByRole('button', { name: 'Add Bench press' }))
    await user.click(screen.getByRole('button', { name: 'Add Running' }))
    const weights = screen.getAllByLabelText('Weight (kg)')
    await user.type(weights[0], '62.5')
    await user.click(screen.getByRole('button', { name: 'Move Running up' }))
    await user.selectOptions(screen.getByLabelText('Status'), 'PLANNED')
    fireEvent.change(screen.getByLabelText('Scheduled date'), { target: { value: '2026-12-01' } })
    await user.selectOptions(screen.getByLabelText(/Mesocycle/), 'cycle')
    await user.click(screen.getByRole('button', { name: 'Schedule workout' }))

    await waitFor(() => expect(action).toHaveBeenCalledOnce())
    const form = action.mock.calls[0][1]
    expect(form.get('name')).toBe('Upper body')
    expect(form.get('scheduledDate')).toBe('2026-12-01')
    expect(form.get('mesocycleId')).toBe('cycle')
    expect(JSON.parse(String(form.get('exercises')))).toMatchObject([
      { exerciseId: 'run', targetWeight: '' },
      { exerciseId: 'bench', targetWeight: '62.5' },
    ])
    expect((await screen.findByRole('alert')).textContent).toBe('Exercise library changed.')
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Upper body')
    expect((screen.getAllByLabelText('Weight (kg)')[1] as HTMLInputElement).value).toBe('62.5')
    await user.click(screen.getByRole('button', { name: 'Remove Running' }))
    expect(screen.getByRole('heading', { name: 'Workout exercises (1)' })).toBeTruthy()
    expect(
      (screen.getByRole('button', { name: 'Add Running' }) as HTMLButtonElement).disabled
    ).toBe(false)
  })

  it('filters the exercise library and prevents duplicate additions', async () => {
    const user = userEvent.setup()
    render(<WorkoutForm action={vi.fn()} options={options} />)
    await user.selectOptions(screen.getByLabelText('Category'), 'AEROBIC')
    const picker = screen.getByRole('region', { name: 'Exercise library' })
    expect(within(picker).queryByText('Bench press')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Add Running' }))
    expect(
      (screen.getByRole('button', { name: 'Added Running' }) as HTMLButtonElement).disabled
    ).toBe(true)
    await user.type(screen.getByLabelText('Search exercises'), 'missing')
    expect(screen.getByText('No exercises match these filters.')).toBeTruthy()
  })
})
