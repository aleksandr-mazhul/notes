import { Link, Navigate, Outlet } from 'react-router'
import { useAuthContext } from '../hooks/useAuthContext.tsx'

export default function Layout() {
  const { user, setUser } = useAuthContext()

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div>
      <header className="mx-auto flex max-w-160 items-center justify-between px-5 pt-6">
        <div className="flex gap-4 text-sm font-medium">
          <Link
            className="text-muted transition-colors hover:text-ink"
            to="/notes"
          >
            Notes
          </Link>
          <Link
            className="text-muted transition-colors hover:text-ink"
            to="/notes/new"
          >
            New note
          </Link>
        </div>
        <div>
          <button
            className="cursor-pointer text-sm text-muted transition-colors hover:text-ink hover:underline"
            onClick={() => setUser(null)}
          >
            Logout
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  )
}
