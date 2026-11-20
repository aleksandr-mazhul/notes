import {
  cardClass,
  checkboxLabelClass,
  fieldClass,
  inputClass,
} from '../styles/ui.ts'
import type { NoteFilter } from '../types'

const chipClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-meta leading-[1.4] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
const chipIdleClass =
  'border-line-strong bg-transparent text-muted hover:border-ink hover:text-ink'
const chipActiveClass =
  'border-ink bg-ink text-white hover:border-ink-hover hover:bg-ink-hover'

interface Props {
  filters: NoteFilter
  onFilterChange: (filters: NoteFilter) => void
  availableTags: string[]
  activeTags: string[]
}

export default function NoteFilterForm({
  filters,
  onFilterChange,
  availableTags,
  activeTags,
}: Props) {
  const { search, showHidden, sort, selectedTags } = filters

  const handleTagToggle = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag]
    onFilterChange({ ...filters, selectedTags: nextTags })
  }

  return (
    <section className={`flex flex-col gap-4 ${cardClass}`}>
      <h2 className="text-meta font-semibold tracking-[0.04em] text-muted uppercase">
        Filters
      </h2>
      <input
        className={inputClass}
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(event) =>
          onFilterChange({ ...filters, search: event.target.value })
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className={checkboxLabelClass}>
          <input
            className="accent-ink"
            type="checkbox"
            checked={showHidden}
            onChange={(event) =>
              onFilterChange({ ...filters, showHidden: event.target.checked })
            }
          />
          Show hidden
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-muted">
          Sort by
          <select
            className={`${fieldClass} cursor-pointer px-2 py-1.5 text-sm`}
            value={sort}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                sort: event.target.value === 'oldest' ? 'oldest' : 'newest',
              })
            }
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-line pb-4">
          <span className="mr-1 text-meta text-muted">Selected:</span>
          {activeTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`group ${chipClass} ${chipActiveClass}`}
              aria-label={`Remove tag ${tag}`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
              <span
                className="text-field leading-none opacity-70 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              >
                ×
              </span>
            </button>
          ))}
          <button
            type="button"
            className="ml-auto cursor-pointer rounded-sm text-meta text-muted transition-colors hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            onClick={() => onFilterChange({ ...filters, selectedTags: [] })}
          >
            Clear all
          </button>
        </div>
      )}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                className={`${chipClass} ${isSelected ? chipActiveClass : chipIdleClass}`}
                aria-pressed={isSelected}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
