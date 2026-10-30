import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

export default function ErrorPage() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">
        {notFound ? 'Page not found' : 'Something went wrong'}
      </h1>
      <Link
        className="text-sm text-muted transition-colors hover:text-ink"
        to="/notes"
      >
        ← Back to notes
      </Link>
    </div>
  )
}
