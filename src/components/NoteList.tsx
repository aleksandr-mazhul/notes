import { useQuery } from '@tanstack/react-query'
import { fetchNotes } from '../api.ts'
import NoteCard from './NoteCard.tsx'

type NoteListProps = {
  queryString: string
  onDelete: (id: string) => void
}

export default function NoteList({ queryString, onDelete }: NoteListProps) {
  const {
    data: notes,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['notes', queryString],
    queryFn: ({ signal }) => fetchNotes(queryString, undefined, signal),
    staleTime: 5 * 60 * 1000,
  })

  if (isPending) {
    return <p className="text-muted">Loading…</p>
  }

  if (isError) {
    return (
      <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-muted">
        Failed to load notes, please try again later
      </p>
    )
  }

  if (notes.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-muted">
        No notes found
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  )
}
