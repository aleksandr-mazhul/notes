import React, { useState } from 'react'

interface Props {
  onFilterChange: (
    filter: string,
    fn: (params: URLSearchParams) => void,
  ) => void
}

export default function NoteFilterForm({ onFilterChange }: Props) {
    const [search, setSearch] = useState()
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
      onFilterChange('search', (params) => {
        onFilterChange('search', (params) => {
          params.set('search', e.target.value)
        })
      })
    }

    const [showHidden, setShowHidden] = useState(true)
    const handleShowHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setShowHidden(e.target.checked)
    }
  }

  return (
    <div>
      filters
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
    </div>
  )
}
