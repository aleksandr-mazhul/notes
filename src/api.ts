import type { Note, NoteDTO, User } from './types.ts'
import { mapNoteFromDTO, mapNoteToDTO } from './utils.ts'

const API_URL = import.meta.env.VITE_API_URL

export const fetchAllTags = (authorId: string, signal?: AbortSignal) => {
  const params = new URLSearchParams()
  params.set('_where', JSON.stringify({ authorId: { eq: authorId } }))
  return get<NoteDTO[]>(`/notes?${params.toString()}`, signal).then(
    (data: NoteDTO[]) => {
      const notes = data.map((note) => mapNoteFromDTO(note))
      return [
        ...new Set(
          notes.flatMap((note) => note.tags).sort((a, b) => a.localeCompare(b)),
        ),
      ]
    },
  )
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
  return get<NoteDTO[]>(`/notes${queryString}`, signal).then(
    (data: NoteDTO[]) => data.map((note) => mapNoteFromDTO(note)),
  )
}

export function fetchUserByCredentials(
  email: string,
  password: string,
): Promise<User | null> {
  const params = new URLSearchParams()
  params.set(
    '_where',
    JSON.stringify({ email: { eq: email }, password: { eq: password } }),
  )
  return get<User[]>(`/users?${params.toString()}`).then(
    (users) => users[0] ?? null,
  )
}

export function findUserByEmail(email: string): Promise<User | null> {
  const params = new URLSearchParams()
  params.set('_where', JSON.stringify({ email: { eq: email } }))
  return get<User[]>(`/users?${params.toString()}`).then(
    (users) => users[0] ?? null,
  )
}

export function createUser(email: string, password: string): Promise<User> {
  return fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, password }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  })
}

export function createNote(note: Omit<Note, 'id'>): Promise<void> {
  return fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapNoteToDTO(note)),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  })
}

export function updateNote(note: Note): Promise<void> {
  return fetch(`${API_URL}/notes/${note.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mapNoteToDTO(note)),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  })
}

export function deleteNote(id: string): Promise<void> {
  return fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' }).then(
    (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    },
  )
}

function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  return fetch(`${API_URL}${path}`, { signal }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  })
}
