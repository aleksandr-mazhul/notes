import { Link, useNavigate, useParams } from 'react-router'
import Button from '../components/Button.tsx'
import { cardClass, hiddenCardClass } from '../styles/ui.ts'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { formatNoteDate } from '../utils.ts'
import { useQuery } from '@tanstack/react-query'
import { fetchNote } from '../api.ts'

export default function NoteViewPage() {
  const { id } = useParams()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const {
    data: note,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['notes', id],
    queryFn: ({ signal }) => fetchNote(id!, signal),
    staleTime: 5 * 60 * 1000,
  })

  const backLink = (
    <Link
      className="text-sm text-muted transition-colors hover:text-ink"
      to="/notes"
    >
      ← Back to notes
    </Link>
  )

  if (isPending) {
    return (
      <div className="mx-auto max-w-160 px-5 pt-12 text-muted">Loading…</div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
        {backLink}
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-muted">
          Failed to load note, please try again later
        </p>
      </div>
    )
  }

  if (!note || note.authorId !== user?.id) {
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
