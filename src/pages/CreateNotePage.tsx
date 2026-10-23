import type { Note } from '../types'
import { useNavigate } from 'react-router'
import NoteForm, { type NoteFormData } from '../components/NoteForm.tsx'
import { cardClass } from '../styles/ui.ts'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { API_URL, mapNoteToDTO } from '../utils.ts'

export default function CreateNotePage() {
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const handleCreate = (data: NoteFormData) => {
    const note = {
      ...data,
      authorId: user!.id,
      createdAt: new Date(),
    } satisfies Omit<Note, 'id'>

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
        navigate('/notes')
      })
      .catch((error) => {
        console.error('Error creating note:', error)
      })
  }

  return (
    <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">New Note</h1>
      <div className={cardClass}>
        <NoteForm submitLabel="Add Note" onSubmit={handleCreate} />
      </div>
    </div>
  )
}
