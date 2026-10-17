import React, { useState } from 'react'
import styles from '../styles/NoteFilterForm.module.css'
import type {NoteQuery} from '../types'

interface Props {
  onFilterChange: (
    filter: string,
    fn: (query: NoteQuery) => void,
  ) => void
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
    <section className={styles.panel}>
      <h2 className={styles.heading}>Filters</h2>
      <input
        className={styles.control}
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={handleSearchChange}
      />
      <div className={styles.row}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={showHidden}
            onChange={handleShowHiddenChange}
          />
          Show hidden
        </label>
        <label className={styles.sort}>
          Sort by
          <select
            className={styles.control}
            defaultValue="newest"
            onChange={handleCreatedAtSortChange}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      {activeTags.length > 0 && (
        <div className={styles.selected}>
          <span className={styles.selectedLabel}>Selected:</span>
          {activeTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`${styles.chip} ${styles.chipActive}`}
              aria-label={`Remove tag ${tag}`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
              <span className={styles.chipRemove} aria-hidden="true">
                ×
              </span>
            </button>

          ))}
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => onTagsChange([])}
          >
            Clear all
          </button>
        </div>
      )}
      {availableTags.length > 0 && (
        <div className={styles.chips}>
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                className={`${styles.chip} ${isSelected ? styles.chipActive : ''}`}
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
