import type {Note} from './types';
import {useState} from "react";
import NoteCard from "./NoteCard.tsx";
import CreateNoteForm from "./CreateNoteForm.tsx";

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    return [
      {
        id: 1,
        title: 'My first note',
        content: 'This is the content of my first note.',
        createdAt: new Date(),
        hidden: false,
        tags: ['work', 'important']
      },
      {
        id: 2,
        title: 'My second note',
        content: 'This is the content of my second note.',
        createdAt: new Date(),
        hidden: true,
        tags: ['personal', 'private']
      },
      {
        id: 3,
        title: 'My third note',
        content: 'This is the content of my third note.',
        createdAt: new Date(),
        hidden: true,
        tags: ['school', 'homework']
      }
    ] satisfies Note[];
  });


  const handleSubmit = (note: Note) => {
    setNotes([...notes, note]);
  };

  return (
    <div>
      <h1>My Notes</h1>
      <CreateNoteForm onSubmit={handleSubmit} />
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
        />
      ))}
    </div>
  )
}

export default App
