import type { NoteFilter, NoteQuery } from '../types'
import { useEffect, useState } from 'react'
import NoteCard from '../components/NoteCard.tsx'
import NoteFilterForm from '../components/NoteFilterForm.tsx'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { Link } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteNote, fetchAllTags, fetchNotes } from '../api.ts'

const buildQueryString = (filters: NoteFilter, tags: string[]) => {
  const query: NoteQuery = {
    where: {},
  }

  Object.values(filters).forEach((fn) => {
    fn(query)
  })

  if (tags.length > 0) {
    query.where.or = tags.map((tag) => ({ tags: { contains: `,${tag},` } }))
  }

  const params = new URLSearchParams()

  if (Object.keys(query.where).length > 0) {
    params.set('_where', JSON.stringify(query.where))
  }

  if (query.sort) {
    params.set('_sort', query.sort)
  }

  return params.toString() ? `?${params.toString()}` : ''
}

export default function NotesPage() {
  const { user } = useAuthContext()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<NoteFilter>({
    sort: (query) => {
      query.sort = '-createdAt'
    },
    authorId: (query) => {
      query.where.authorId = { eq: user!.id }
    },
  })

  const [availableTags, setAvailableTags] = useState<string[]>([])
  useEffect(() => {
    fetchAllTags(user!.id)
      .then((tags) => {
        setAvailableTags(tags)
      })
      .catch((error) => console.error('Error fetching tags:', error))
  }, [user])

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const activeTags = selectedTags.filter((tag) => availableTags.includes(tag))
  const queryString = buildQueryString(filters, activeTags)

  const handleFilterChange = (
    filter: string,
    fn: (query: NoteQuery) => void,
  ) => {
    setFilters((prev) => ({ ...prev, [filter]: fn }))
  }

  const {
    data: notes,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['notes', queryString],
    queryFn: ({ signal }) => fetchNotes(queryString, signal),
    staleTime: 5 * 60 * 1000,
  })

  const handleDelete = (id: string) => {
    deleteNote(id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['notes', queryString] })
        return fetchAllTags(user!.id)
      })
      .then((tags) => {
        setAvailableTags(tags)
      })
      .catch((error) => {
        console.error('Error deleting note:', error)
      })
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-160 px-5 pt-12 text-muted">Loading…</div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-muted">
          Failed to load notes, please try again later
        </p>
      </div>
    )
  }

  return (
    <>
      <Link
        to={'/notes/new'}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-ink px-4 py-2 text-white shadow-lg transition-transform hover:scale-105"
      >
        New Note
      </Link>
      <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">My Notes</h1>
        <NoteFilterForm
          onFilterChange={handleFilterChange}
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          activeTags={activeTags}
        />
        {notes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-muted">
            No notes found
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
