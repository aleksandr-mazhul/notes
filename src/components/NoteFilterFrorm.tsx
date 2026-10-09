import React, { useState } from 'react'

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
    <div>
      <h2>Filters</h2>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearchChange}
      />
      <input
        type="checkbox"
        checked={showHidden}
        onChange={handleShowHiddenChange}
      />
      <label htmlFor="show-hidden">Show Hidden</label>
      <label htmlFor="sort">Sort by:</label>
      <select
        id="sort"
        defaultValue="newest"
        onChange={handleCreatedAtSortChange}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      <div>
        {availableTags.map((tag) => (
          <label key={tag}>
            <input
              type="checkbox"
              checked={selectedTags.includes(tag)}
              onChange={() => handleTagToggle(tag)}
            />
            {tag}
          </label>
        ))}
      </div>
    </div>
  )
}
