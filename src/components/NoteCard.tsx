import type { Note } from '../types'
import { cardClass } from '../styles/ui.ts'
import Button from './Button.tsx'

interface Props {
  note: Note
  onDelete: (id: string) => void
}

export default function NoteCard({ note, onDelete }: Props) {
  return (
    <article className={`flex flex-col gap-2 ${cardClass}`}>
      <header className="flex items-baseline justify-between gap-4">
        <h2 className="text-card-title font-semibold">{note.title}</h2>
        <span className="text-meta text-muted">
          {note.hidden ? 'Hidden' : 'Visible'}
        </span>
      </header>
      <p className="text-meta text-muted">{note.createdAt.toLocaleString()}</p>
      {note.content && (
        <p className="mt-1 whitespace-pre-wrap wrap-anywhere">{note.content}</p>
      )}
      <footer className="mt-2 flex items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-1.5">
          {note.tags.map((tag, index) => (
            <li
              key={`${tag}-${index}`}
              className="rounded-full bg-tag px-2.5 py-0.5 text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
        <Button variant="danger" onClick={() => onDelete(note.id)}>
          Delete
        </Button>
      </footer>
    </article>
  )
}
