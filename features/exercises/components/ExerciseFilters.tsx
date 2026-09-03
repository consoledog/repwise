import Link from 'next/link'
import { Search } from 'lucide-react'
import { exerciseCategoryOptions, type ExerciseFilters as ExerciseFiltersType } from '../types'

type ExerciseFiltersProps = {
  filters: ExerciseFiltersType
}

export function ExerciseFilters({ filters }: ExerciseFiltersProps) {
  return (
    <form action="/exercises" className="mobile-panel grid gap-3 p-4 md:grid-cols-[1fr_14rem_auto]">
      <div className="space-y-2">
        <label htmlFor="search" className="field-label">
          Search
        </label>
        <input
          id="search"
          name="search"
          type="search"
          defaultValue={filters.search}
          className="field-input"
          placeholder="Name or description"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="field-label">
          Category
        </label>
        <select id="category" name="category" defaultValue={filters.category} className="field-input">
          <option value="ALL">All categories</option>
          {exerciseCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end gap-2">
        <button type="submit" className="control-button control-button-primary flex-1 md:flex-none">
          <Search size={17} aria-hidden="true" />
          <span>Filter</span>
        </button>
        <Link href="/exercises" className="control-button control-button-secondary">
          Reset
        </Link>
      </div>
    </form>
  )
}
