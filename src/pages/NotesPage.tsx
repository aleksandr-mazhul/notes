import type { Note, NoteDTO, NoteFilter, NoteQuery } from '../types'
import { useEffect, useState } from 'react'
import NoteCard from '../components/NoteCard.tsx'
import { API_URL, mapNoteFromDTO } from '../utils.ts'
import NoteFilterForm from '../components/NoteFilterForm.tsx'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { Link } from 'react-router'

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

const fetchAllTags = (authorId: string) => {
  const params = new URLSearchParams()
  params.set('_where', JSON.stringify({ authorId: { eq: authorId } }))
  return fetch(`${API_URL}/notes?${params.toString()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((data: NoteDTO[]) => {
      const notes = data.map((note) => mapNoteFromDTO(note))
      return [
        ...new Set(
          notes.flatMap((note) => note.tags).sort((a, b) => a.localeCompare(b)),
        ),
      ]
    })
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const { user } = useAuthContext()

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

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_URL}/notes${queryString}`, { signal: controller.signal })
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
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Error fetching notes:', error)
        }
      })

    return () => {
      controller.abort()
    }
  }, [queryString])

  const handleDelete = (id: string) => {
    fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return fetch(`${API_URL}/notes${queryString}`)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data: NoteDTO[]) => {
        setNotes(data.map((note) => mapNoteFromDTO(note)))
        return fetchAllTags(user!.id)
      })
      .then((tags) => {
        setAvailableTags(tags)
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Error deleting note:', error)
        }
      })
  }

  return (
    <>
      <Link
        to={'/notes/new'}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-primary px-4 py-2 text-white shadow-lg transition-transform hover:scale-105"
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
