import type { Note } from '../types'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import NoteForm, { type NoteFormData } from '../components/NoteForm.tsx'
import { cardClass } from '../styles/ui.ts'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { API_URL, fetchNote, mapNoteToDTO } from '../utils.ts'

type Status = 'loading' | 'ready' | 'not-found'

export default function EditNotePage() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [note, setNote] = useState<Note | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  // Same loading and owner check as on the view page
  useEffect(() => {
    if (!id || !user) {
      return
    }

    fetchNote(id)
      .then((fetchedNote) => {
        if (fetchedNote && fetchedNote.authorId === user.id) {
          setNote(fetchedNote)
          setStatus('ready')
        } else {
          setStatus('not-found')
        }
      })
      .catch((error) => {
        console.error('Error fetching note:', error)
        setStatus('not-found')
      })
  }, [id, user])

  const handleSave = (data: NoteFormData) => {
    if (!note) {
      return
    }

    const updatedNote = {
      ...note,
      ...data,
    }

    fetch(`${API_URL}/notes/${note.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapNoteToDTO(updatedNote)),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        navigate(`/notes/${note.id}`)
      })
      .catch((error) => {
        console.error('Error updating note:', error)
      })
  }

  const backLink = (
    <Link
      className="text-sm text-muted transition-colors hover:text-ink"
      to={`/notes/${id}`}
    >
      ← Back to note
    </Link>
  )

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-160 px-5 pt-12 text-muted">Loading…</div>
    )
  }

  if (status === 'not-found' || !note) {
    return (
      <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
        {backLink}
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-muted">
          Note not found
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
      {backLink}
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Edit Note</h1>
      <div className={cardClass}>
        <NoteForm
          submitLabel="Save"
          defaultValues={{
            title: note.title,
            content: note.content,
            tags: note.tags,
            hidden: note.hidden,
          }}
          onSubmit={handleSave}
        />
      </div>
    </div>
  )
}
