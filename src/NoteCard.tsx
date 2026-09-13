import type {Note} from "./types";
import styles from './NoteCard.module.css';

interface Props {
  note: Note;
}

export default function NoteCard({note}: Props) {
  return (
    <div className={styles.container}>
      <h2>{note.title}</h2>
      <div className={styles.row}>
        <p>{note.createdAt.toLocaleString()}</p>
        <p>{note.hidden ? 'Hidden' : 'Visible'}</p>
      </div>
      <p>{note.content}</p>
    </div>
  )
}