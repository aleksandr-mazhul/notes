import { Link, Navigate, Outlet } from 'react-router'
import { useAuthContext } from '../hooks/useAuthContext.tsx'

export default function Layout() {
  const { user, setUser } = useAuthContext()

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div>
      <header>
        <div>
          <Link to="/notes">Notes</Link>
        </div>
        <div>
          <button onClick={() => setUser(null)}>Logout</button>
        </div>
      </header>

      <Outlet />
    </div>
  )
}
