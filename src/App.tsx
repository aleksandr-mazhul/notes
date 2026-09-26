import type { Note, NoteDTO, NoteFilter } from './types'
import { useEffect, useState } from 'react'
import NoteCard from './NoteCard.tsx'
import CreateNoteForm from './CreateNoteForm.tsx'
import { mapNoteFromDTO, mapNoteToDTO } from './utils.ts'
import styles from './App.module.css'
import NoteFilterForm from './NoteFilterFrorm.tsx'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filters, setFilters] = useState<NoteFilter>({
    showHidden: (params) => params.set('showHidden', 'true'),
  })

  const handleFilterChange = (
    filter: string,
    fn: (params: URLSearchParams) => void,
  ) => {
    setFilters((prev) => ({ ...prev, [filter]: fn }))
  }

  useEffect(() => {
    const params = new URLSearchParams()
    Object.values(filters).forEach((fn) => {
      fn(params)
    })

    fetch('http://localhost:3000/notes')
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
        console.error('Error fetching notes:', error)
      })
  }, [])

  const handleSubmit = (note: Omit<Note, 'id'>) => {
    fetch('http://localhost:3000/notes', {
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
        return response.json()
      })
      .then((data: NoteDTO) => {
        setNotes((prevNotes) => [...prevNotes, mapNoteFromDTO(data)])
      })
      .catch((error) => {
        console.error('Error creating note:', error)
      })
  }

  const handleDelete = (id: string) => {
    fetch(`http://localhost:3000/notes/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        setNotes((prevNotes) =>
          prevNotes.filter((note) => {
            return note.id !== id
          }),
        )
      })
      .catch((error) => {
        console.error('Error deleting note:', error)
      })
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>My Notes</h1>
      <CreateNoteForm onSubmit={handleSubmit} />
      <NoteFilterForm onFilterChange={handleFilterChange} />
      <div className={styles.list}>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}

export default App
