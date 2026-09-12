import type {Note} from './types';
import {useState} from "react";

function App() {
  const [notes] = useState<Note[]>(() => {
    return [
      {
        title: 'My first note',
        content: 'This is the content of my first note.',
        createdAt: new Date(),
        hidden: false,
      },
      {
        title: 'My second note',
        content: 'This is the content of my second note.',
        createdAt: new Date(),
        hidden: false,
      },
      {
        title: 'My third note',
        content: 'This is the content of my third note.',
        createdAt: new Date(),
        hidden: false,
      }
    ] satisfies Note[];
  });

  return (
    <div>
      <h1>My Notes</h1>
      {notes.map((note, index) => (
        <div key={index}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <p>{note.createdAt.toLocaleString()}</p>
          <p>{note.hidden ? 'Hidden' : 'Visible'}</p>
        </div>
      ))}
    </div>
  )
}

export default App
