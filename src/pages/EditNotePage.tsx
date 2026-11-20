import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router'
import NoteForm, { type NoteFormData } from '../components/NoteForm.tsx'
import { cardClass } from '../styles/ui.ts'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { fetchNote, updateNote } from '../api.ts'
import type { Note } from '../types'

export default function EditNotePage() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: note,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['notes', id],
    queryFn: ({ signal }) => fetchNote(id!, signal),
    enabled: Boolean(id && user),
    staleTime: 5 * 60 * 1000,
  })

  const mutationKey = ['notes', 'update', id]
  const isSaving = useIsMutating({ mutationKey, exact: true }) > 0
  const updateMutation = useMutation({
    mutationKey,
    mutationFn: updateNote,
    onMutate: async (updatedNote) => {
      const queryKey = ['notes', updatedNote.id]
      await queryClient.cancelQueries({ queryKey, exact: true })
      const previousNote = queryClient.getQueryData<Note | null>(queryKey)

      queryClient.setQueryData(queryKey, updatedNote)
      navigate(`/notes/${updatedNote.id}`)
      return { queryKey, previousNote }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
    onError: (error, _updatedNote, snapshot) => {
      if (snapshot) {
        queryClient.setQueryData(snapshot.queryKey, snapshot.previousNote)
      }
      console.error('Error updating note:', error)
    },
  })

  const handleSave = (data: NoteFormData) => {
    if (!note) {
      return
    }

    const updatedNote = {
      ...note,
      ...data,
    }

    updateMutation.mutate(updatedNote)
  }

  const backLink = (
    <Link
      className="text-sm text-muted transition-colors hover:text-ink"
      to={`/notes/${id}`}
    >
      ← Back to note
    </Link>
  )

  if (id && user && isPending) {
    return (
      <div className="mx-auto max-w-160 px-5 pt-12 text-muted">Loading…</div>
    )
  }

  if (!note || note.authorId !== user?.id) {
    return (
      <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
        {backLink}
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-muted">
          {isError
            ? 'Failed to load note, please try again later'
            : 'Note not found'}
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
          key={note.id}
          submitLabel="Save"
          submitDisabled={isSaving}
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
