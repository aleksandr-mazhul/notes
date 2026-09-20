import type { Note, NoteDTO } from './types'
import { useEffect, useState } from 'react'
import NoteCard from './NoteCard.tsx'
import CreateNoteForm from './CreateNoteForm.tsx'
import { mapNoteFromDTO, mapNoteToDTO } from './utils.ts'

function App() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
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
    <div>
      <h1>My Notes</h1>
      <CreateNoteForm onSubmit={handleSubmit} />
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={handleDelete} />
      ))}
    </div>
  )
}

export default App
