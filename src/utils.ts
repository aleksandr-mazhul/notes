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

export function mapNoteToDTO(note: Omit<Note, 'id'>): Omit<NoteDTO, 'id'> {
  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    tags: note.tags.length > 0 ? `,${note.tags.join(',')},` : '',
  }
}
