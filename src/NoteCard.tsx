import type { Note } from './types'
import styles from './NoteCard.module.css'
import Button from './Button.tsx'

interface Props {
  note: Note
  onDelete: (id: string) => void
}

export default function NoteCard({ note, onDelete }: Props) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{note.title}</h2>
        <span className={styles.status}>
          {note.hidden ? 'Hidden' : 'Visible'}
        </span>
      </header>
      <p className={styles.date}>{note.createdAt.toLocaleString()}</p>
      {note.content && <p className={styles.content}>{note.content}</p>}
      <footer className={styles.footer}>
        <ul className={styles.tags}>
          {note.tags.map((tag, index) => (
            <li key={`${tag}-${index}`} className={styles.tag}>
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
