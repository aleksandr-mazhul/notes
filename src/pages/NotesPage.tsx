import type { NoteFilter, NoteQuery } from '../types'
import { useEffect, useState } from 'react'
import NoteList from '../components/NoteList.tsx'
import NoteFilterForm from '../components/NoteFilterForm.tsx'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { Link } from 'react-router'
import {
  type InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  deleteNote,
  fetchAllTags,
  notesListQueryKey,
  type NotesPageResult,
} from '../api.ts'

function readFilters(storageKey: string): NoteFilter {
  let savedFilters: string | null
  try {
    savedFilters = sessionStorage.getItem(storageKey)
  } catch {
    savedFilters = null
  }

  const params = new URLSearchParams(savedFilters ?? '')
  return {
    search: params.get('search') ?? '',
    showHidden: params.get('showHidden') !== 'false',
    sort: params.get('sort') === 'oldest' ? 'oldest' : 'newest',
    selectedTags: params.getAll('tag'),
  }
}

const buildQueryString = (
  filters: NoteFilter,
  tags: string[],
  authorId: string,
) => {
  const query: NoteQuery = {
    where: { authorId: { eq: authorId } },
    sort: filters.sort === 'newest' ? '-createdAt,id' : 'createdAt,id',
  }

  const search = filters.search.trim()
  if (search) {
    query.where.title = { contains: search }
  }
  if (!filters.showHidden) {
    query.where.hidden = { eq: false }
  }

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
  const userId = user!.id
  const storageKey = `notes:filters:${userId}`
  const [filters, setFilters] = useState(() => readFilters(storageKey))
  const { data: availableTags } = useQuery({
    queryKey: ['notes', 'tags', userId],
    queryFn: ({ signal }) => fetchAllTags(userId, signal),
    staleTime: 5 * 60 * 1000,
  })
  const activeTags = availableTags
    ? filters.selectedTags.filter((tag) => availableTags.includes(tag))
    : filters.selectedTags
  const queryString = buildQueryString(filters, activeTags, userId)

  useEffect(() => {
    const params = new URLSearchParams({
      search: filters.search,
      showHidden: String(filters.showHidden),
      sort: filters.sort,
    })
    filters.selectedTags.forEach((tag) => params.append('tag', tag))

    try {
      sessionStorage.setItem(storageKey, params.toString())
    } catch {
      return
    }
  }, [filters, storageKey])

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onMutate: async (id) => {
      const queryKey = notesListQueryKey(queryString)
      await queryClient.cancelQueries({ queryKey, exact: true })

      const previousNotes =
        queryClient.getQueryData<InfiniteData<NotesPageResult, number>>(
          queryKey,
        )
      queryClient.setQueryData<InfiniteData<NotesPageResult, number>>(
        queryKey,
        (current) =>
          current && {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              data: page.data.filter((note) => note.id !== id),
            })),
          },
      )
      return { queryKey, previousNotes }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
    onError: (error, id, snapshot) => {
      console.error('Error deleting note:', error)
      if (!snapshot?.previousNotes) {
        return
      }

      const { queryKey, previousNotes } = snapshot
      const pageIndex = previousNotes.pages.findIndex((page) =>
        page.data.some((note) => note.id === id),
      )
      const previousPage = previousNotes.pages[pageIndex]
      if (!previousPage) {
        return
      }

      const noteIndex = previousPage.data.findIndex((note) => note.id === id)
      const note = previousPage.data[noteIndex]
      queryClient.setQueryData<InfiniteData<NotesPageResult, number>>(
        queryKey,
        (current) => {
          if (
            !current ||
            current.pages.some((page) =>
              page.data.some((note) => note.id === id),
            )
          ) {
            return current
          }

          return {
            ...current,
            pages: current.pages.map((page, index) =>
              index === pageIndex
                ? { ...page, data: page.data.toSpliced(noteIndex, 0, note) }
                : page,
            ),
          }
        },
      )
    },
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
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
          filters={filters}
          onFilterChange={setFilters}
          availableTags={availableTags ?? []}
          activeTags={activeTags}
        />
        <NoteList queryString={queryString} onDelete={handleDelete} />
      </div>
    </>
  )
}
