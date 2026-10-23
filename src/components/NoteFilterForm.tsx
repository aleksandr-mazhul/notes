import React, { useState } from 'react'
import {
  cardClass,
  checkboxLabelClass,
  fieldClass,
  inputClass,
} from '../styles/ui.ts'
import type { NoteQuery } from '../types'

const chipClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-meta leading-[1.4] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'
const chipIdleClass =
  'border-line-strong bg-transparent text-muted hover:border-ink hover:text-ink'
const chipActiveClass =
  'border-ink bg-ink text-white hover:border-ink-hover hover:bg-ink-hover'

interface Props {
  onFilterChange: (filter: string, fn: (query: NoteQuery) => void) => void
  availableTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  activeTags: string[]
}

export default function NoteFilterForm({
  onFilterChange,
  availableTags,
  selectedTags,
  onTagsChange,
  activeTags,
}: Props) {
  const [search, setSearch] = useState('')
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)

    const value = e.target.value.trim()
    onFilterChange('search', (query) => {
      if (value) {
        query.where.title = { contains: value }
      }
    })
  }

  const [showHidden, setShowHidden] = useState(true)
  const handleShowHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowHidden(e.target.checked)
    if (!e.target.checked) {
      onFilterChange('hidden', (query) => {
        query.where.hidden = { eq: false }
      })
    } else {
      onFilterChange('hidden', (query) => {
        delete query.where.hidden
      })
    }
  }

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleCreatedAtSortChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value
    onFilterChange('sort', (query) => {
      query.sort = value === 'newest' ? '-createdAt' : 'createdAt'
    })
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
        onChange={handleSearchChange}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className={checkboxLabelClass}>
          <input
            className="accent-ink"
            type="checkbox"
            checked={showHidden}
            onChange={handleShowHiddenChange}
          />
          Show hidden
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-muted">
          Sort by
          <select
            className={`${fieldClass} cursor-pointer px-2 py-1.5 text-sm`}
            defaultValue="newest"
            onChange={handleCreatedAtSortChange}
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
            onClick={() => onTagsChange([])}
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
