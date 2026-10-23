import { createBrowserRouter, Link, RouterProvider } from 'react-router'
import LoginPage from '../pages/LoginPage.tsx'
import RegisterPage from '../pages/RegisterPage.tsx'
import NotesPage from '../pages/NotesPage.tsx'
import CreateNotePage from '../pages/CreateNotePage.tsx'
import NoteViewPage from '../pages/NoteViewPage.tsx'
import EditNotePage from '../pages/EditNotePage.tsx'
import Layout from '../pages/Layout.tsx'
import AuthProvider from './AuthProvider.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="mx-auto flex max-w-160 items-center gap-2 px-5 pt-12">
        home page
        <Link className="font-medium underline" to="/login">
          Login
        </Link>
        <Link className="font-medium underline" to="/register">
          Register
        </Link>
      </div>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/notes',
        element: <NotesPage />,
      },
      {
        path: '/notes/new',
        element: <CreateNotePage />,
      },
      {
        path: '/notes/:id',
        element: <NoteViewPage />,
      },
      {
        path: '/notes/:id/edit',
        element: <EditNotePage />,
      },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
