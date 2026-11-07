import type { Note } from '../types'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Button from '../components/Button.tsx'
import { cardClass, hiddenCardClass } from '../styles/ui.ts'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { fetchNote, formatNoteDate } from '../utils.ts'

type State =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'ready'; note: Note }

export default function NoteViewPage() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    if (!id || !user) {
      return
    }

    const controller = new AbortController()
    fetchNote(id, controller.signal)
      .then((fetchedNote) => {
        if (fetchedNote && fetchedNote.authorId === user.id) {
          setState({ status: 'ready', note: fetchedNote })
        } else {
          setState({ status: 'not-found' })
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return
        }
        console.error('Error fetching note:', error)
        setState({ status: 'not-found' })
      })

    return () => {
      controller.abort()
    }
  }, [id, user])

  const backLink = (
    <Link
      className="text-sm text-muted transition-colors hover:text-ink"
      to="/notes"
    >
      ← Back to notes
    </Link>
  )

  if (state.status === 'loading') {
    return (
      <div className="mx-auto max-w-160 px-5 pt-12 text-muted">Loading…</div>
    )
  }

  if (state.status === 'not-found') {
    return (
      <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
        {backLink}
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-muted">
          Note not found
        </p>
      </div>
    )
  }

  const { note } = state

  return (
    <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
      {backLink}
      <article
        className={`flex flex-col gap-3 ${note.hidden ? hiddenCardClass : cardClass}`}
      >
        <header className="flex items-baseline justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-[-0.01em] wrap-anywhere">
            {note.title}
          </h1>
          <span className="text-meta text-muted">
            {note.hidden ? 'Hidden' : 'Visible'}
          </span>
        </header>
        <time
          className="text-meta text-muted"
          dateTime={note.createdAt.toISOString()}
        >
          {formatNoteDate(note.createdAt)}
        </time>
        {note.tags.length > 0 && (
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
        )}
        {note.content ? (
          <p className="whitespace-pre-wrap wrap-anywhere">{note.content}</p>
        ) : (
          <p className="text-muted">No content</p>
        )}
        <footer className="mt-2 flex justify-end">
          <Button onClick={() => navigate(`/notes/${note.id}/edit`)}>
            Edit
          </Button>
        </footer>
      </article>
    </div>
  )
}
