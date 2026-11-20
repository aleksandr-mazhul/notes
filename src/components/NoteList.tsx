import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchNotes, notesListQueryKey } from '../api.ts'
import Button from './Button.tsx'
import NoteCard from './NoteCard.tsx'

type NoteListProps = {
  queryString: string
  onDelete: (id: string) => void
}

export default function NoteList({ queryString, onDelete }: NoteListProps) {
  const {
    data,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: notesListQueryKey(queryString),
    queryFn: ({ pageParam, signal }) =>
      fetchNotes(queryString, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next,
    staleTime: 5 * 60 * 1000,
  })

  if (isPending) {
    return <p className="text-muted">Loading…</p>
  }

  if (isError && !data) {
    return (
      <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-muted">
        Failed to load notes, please try again later
      </p>
    )
  }

  const notes = data?.pages.flatMap((page) => page.data) ?? []

  if (notes.length === 0 && !hasNextPage) {
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
      {isFetchNextPageError && (
        <p className="text-sm text-danger" role="alert">
          Could not load more notes. Try again.
        </p>
      )}
      {hasNextPage && (
        <Button
          className="self-center"
          type="button"
          disabled={isFetching}
          onClick={() => void fetchNextPage({ cancelRefetch: false })}
        >
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </Button>
      )}
    </div>
  )
}
