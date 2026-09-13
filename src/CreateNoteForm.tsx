import {useState} from "react";
import type {Note} from './types';

interface Props {
  onSubmit: (note: Note) => void;
}

export default function CreateNoteForm({onSubmit}: Props) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const note: Note = {
      id: Date.now(),
      title: title.trim(),
      content: '',
      createdAt: new Date(),
      hidden: false,
    };

    onSubmit(note);
    setTitle('');
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setTitle(e.target.value)}
        name="title"
      />
      <button type="submit">Add Note</button>
    </form>
  )
}