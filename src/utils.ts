import type { Note, NoteDTO } from './types'

export const API_URL = 'http://localhost:3000'

export function mapNoteFromDTO(note: NoteDTO): Note {
  return {
    ...note,
    createdAt: new Date(note.createdAt),
    tags: note.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== ''),
  }
}

export function fetchNote(id: string): Promise<Note | null> {
  return fetch(`${API_URL}/notes/${id}`).then((response) => {
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json().then((note: NoteDTO) => mapNoteFromDTO(note))
  })
}

export function mapNoteToDTO(note: Omit<Note, 'id'>): Omit<NoteDTO, 'id'> {
  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    tags: note.tags.length > 0 ? `,${note.tags.join(',')},` : '',
  }
}
