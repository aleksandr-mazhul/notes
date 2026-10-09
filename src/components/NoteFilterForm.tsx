import React, { useState } from 'react'
import styles from '../styles/NoteFilterForm.module.css'

interface Props {
  onFilterChange: (
    filter: string,
    fn: (params: URLSearchParams) => void,
  ) => void
  availableTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export default function NoteFilterForm({
  onFilterChange,
  availableTags,
  selectedTags,
  onTagsChange,
}: Props) {
  const [search, setSearch] = useState('')
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)

    const value = e.target.value.trim()
    onFilterChange('search', (params) => {
      if (value) {
        params.set('title:contains', value)
      }
    })
  }

  const [showHidden, setShowHidden] = useState(true)
  const handleShowHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowHidden(e.target.checked)
    if (!e.target.checked) {
      onFilterChange('hidden', (params) => {
        params.set('hidden', 'false')
      })
    } else {
      onFilterChange('hidden', (params) => {
        params.delete('hidden')
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
    onFilterChange('sort', (params) => {
      params.set('_sort', value === 'newest' ? '-createdAt' : 'createdAt')
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
                {isSelected && (
                  <span className={styles.chipRemove} aria-hidden="true">
                    ×
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
