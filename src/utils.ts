import type { Note, NoteDTO } from './types'

export const API_URL = 'http://localhost:3000'

const noteDateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatNoteDate(date: Date): string {
  return noteDateFormat.format(date)
}

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
