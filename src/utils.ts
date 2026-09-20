import type {Note, NoteDTO} from './types';

export function mapNoteFromDTO(note: NoteDTO): Note {
  return {
    ...note,
    createdAt: new Date(note.createdAt),
  };
}

export function mapNoteToDTO(note: Note): NoteDTO {
  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
  };
}