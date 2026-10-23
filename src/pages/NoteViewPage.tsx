import type { Note } from '../types'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Button from '../components/Button.tsx'
import { cardClass, hiddenCardClass } from '../styles/ui.ts'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { fetchNote } from '../utils.ts'

type Status = 'loading' | 'ready' | 'not-found'

export default function NoteViewPage() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [note, setNote] = useState<Note | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (!id || !user) {
      return
    }

    fetchNote(id)
      .then((fetchedNote) => {
        if (fetchedNote && fetchedNote.authorId === user.id) {
          setNote(fetchedNote)
          setStatus('ready')
        } else {
          setStatus('not-found')
        }
      })
      .catch((error) => {
        console.error('Error fetching note:', error)
        setStatus('not-found')
      })
  }, [id, user])

  const backLink = (
    <Link
      className="text-sm text-muted transition-colors hover:text-ink"
      to="/notes"
    >
      ← Back to notes
    </Link>
  )

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-160 px-5 pt-12 text-muted">Loading…</div>
    )
  }

  if (status === 'not-found' || !note) {
    return (
      <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
        {backLink}
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-muted">
          Note not found
        </p>
      </div>
    )
  }

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
        <p className="text-meta text-muted">
          {note.createdAt.toLocaleString()}
        </p>
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
