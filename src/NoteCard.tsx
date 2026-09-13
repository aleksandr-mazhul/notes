import type { Note } from "./types";

interface Props {
  note: Note;
}

export default function NoteCard({note}: Props) {
  return (

    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>{note.createdAt.toLocaleString()}</p>
      <p>{note.hidden ? 'Hidden' : 'Visible'}</p>
    </div>
  )
}