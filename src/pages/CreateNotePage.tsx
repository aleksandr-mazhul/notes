import type { Note } from '../types'
import { useNavigate } from 'react-router'
import NoteCard from '../components/NoteCard.tsx'
import NoteForm, { type NoteFormData } from '../components/NoteForm.tsx'
import { cardClass } from '../styles/ui.ts'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { createNote } from '../api.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function CreateNotePage() {
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] })
      navigate('/notes')
    },
    onError: (error) => console.error('Error creating note:', error),
  })
  const pendingNote = createMutation.isPending
    ? createMutation.variables
    : undefined

  const handleCreate = (data: NoteFormData) => {
    const note = {
      ...data,
      authorId: user!.id,
      createdAt: new Date(),
    } satisfies Omit<Note, 'id'>

    createMutation.mutate(note)
  }

  return (
    <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">New Note</h1>
      {pendingNote && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted" role="status">
            Saving note…
          </p>
          <NoteCard note={pendingNote} />
        </div>
      )}
      <div className={cardClass}>
        <NoteForm
          submitLabel="Add Note"
          submitDisabled={createMutation.isPending}
          onSubmit={handleCreate}
        />
        {createMutation.isError && (
          <p className="mt-3 text-sm text-danger" role="alert">
            Could not save the note. Try again.
          </p>
        )}
      </div>
    </div>
  )
}
