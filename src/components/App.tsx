import type { Note, NoteDTO, NoteFilter } from '../types'
import { useEffect, useState } from 'react'
import NoteCard from './NoteCard.tsx'
import CreateNoteForm from './CreateNoteForm.tsx'
import { mapNoteFromDTO, mapNoteToDTO } from '../utils.ts'
import styles from '../styles/App.module.css'
import NoteFilterForm from './NoteFilterForm.tsx'

const API_URL = 'http://localhost:3000'

const buildQueryString = (filters: NoteFilter) => {
  const params = new URLSearchParams()
  Object.values(filters).forEach((fn) => {
    fn(params)
  })
  return params.toString() ? `?${params.toString()}` : ''
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filters, setFilters] = useState<NoteFilter>({
    sort: (params) => {
      params.set('_sort', '-createdAt')
    },
  })

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const availableTags = [...new Set(notes.flatMap((note) => note.tags))]
  // a selected tag can vanish from the list (search, delete) — ignore it
  const activeTags = selectedTags.filter((tag) => availableTags.includes(tag))
  const visibleNotes =
    activeTags.length === 0
      ? notes
      : notes.filter((note) =>
          note.tags.some((tag) => activeTags.includes(tag)),
        )

  const handleFilterChange = (
    filter: string,
    fn: (params: URLSearchParams) => void,
  ) => {
    setFilters((prev) => ({ ...prev, [filter]: fn }))
  }

  useEffect(() => {
    // responses can arrive out of order when filters change quickly
    let ignore = false

    fetch(`${API_URL}/notes${buildQueryString(filters)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data: NoteDTO[]) => {
        if (!ignore) {
          setNotes(data.map((note) => mapNoteFromDTO(note)))
        }
      })
      .catch((error) => {
        console.error('Error fetching notes:', error)
      })

    return () => {
      ignore = true
    }
  }, [filters])

  const handleSubmit = (note: Omit<Note, 'id'>) => {
    fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapNoteToDTO(note)),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return fetch(`${API_URL}/notes${buildQueryString(filters)}`)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data: NoteDTO[]) => {
        setNotes(data.map((note) => mapNoteFromDTO(note)))
      })
      .catch((error) => {
        console.error('Error creating note:', error)
      })
  }

  const handleDelete = (id: string) => {
    fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return fetch(`${API_URL}/notes${buildQueryString(filters)}`)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data: NoteDTO[]) => {
        setNotes(data.map((note) => mapNoteFromDTO(note)))
      })
      .catch((error) => {
        console.error('Error deleting note:', error)
      })
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>My Notes</h1>
      <CreateNoteForm onSubmit={handleSubmit} />
      <NoteFilterForm
        onFilterChange={handleFilterChange}
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />
      {visibleNotes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        <div className={styles.list}>
          {visibleNotes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
