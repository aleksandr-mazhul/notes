import {useState} from "react";
import type {Note} from './types';

interface Props {
  onSubmit: (note: Note) => void;
}

export default function CreateNoteForm({onSubmit}: Props) {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  const [tags, setTags] = useState('');
  const [tagsError, setTagsError] = useState('');

  const [content, setContent] = useState('');
  const [hidden, setHidden] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentTitle = title.trim();
    if (currentTitle.length === 0) {
      setTitleError('Title is required');
      return
    }
    if (tagsError) {
      return;
    }

    const currentTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (currentTags.length > 5) {
      setTagsError('You can only add up to 5 tags');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date(),
      hidden: hidden,
      tags: currentTags
    };

    onSubmit(note);
    setTitle('');
    setTags('');
    setContent('');
    setHidden(false);
    setTitleError('');

    setTagsError('');
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setTitle(e.target.value)}
          name="title"
        />
        {titleError && <p>{titleError}</p>}
      </div>
      <div>
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setContent(e.target.value)}
          name="content"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Tags"
          value={tags}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            setTags(e.target.value);
            setTagsError('');
          }}
          name="tags"
        />
        {tagsError && <p>{tagsError}</p>}
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={hidden}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setHidden(e.target.checked)}
            name="hidden"
          />
          Hidden
        </label>
      </div>
      <button type="submit">Add Note</button>
    </form>
  )
}
