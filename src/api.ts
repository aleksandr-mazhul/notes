import type { Note, NoteDTO } from './types.ts'
import { API_URL, mapNoteFromDTO } from './utils.ts'

export const fetchAllTags = (authorId: string, signal?: AbortSignal) => {
  const params = new URLSearchParams()
  params.set('_where', JSON.stringify({ authorId: { eq: authorId } }))
  return fetch(`${API_URL}/notes?${params.toString()}`, { signal })
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

export function fetchNote(
  id: string,
  signal?: AbortSignal,
): Promise<Note | null> {
  return fetch(`${API_URL}/notes/${id}`, { signal }).then((response) => {
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json().then((note: NoteDTO) => mapNoteFromDTO(note))
  })
}

export function fetchNotes(
  queryString: string,
  signal?: AbortSignal,
): Promise<Note[]> {
  return fetch(`${API_URL}/notes${queryString}`, { signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((data: NoteDTO[]) => data.map((note) => mapNoteFromDTO(note)))
}
