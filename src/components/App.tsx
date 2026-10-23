import { createBrowserRouter, Link, RouterProvider } from 'react-router'
import LoginPage from '../pages/LoginPage.tsx'
import NotePage from '../pages/NotePage.tsx'
import CreateNotePage from '../pages/CreateNotePage.tsx'
import Layout from '../pages/Layaut.tsx'
import { AuthProvider } from '../hooks/useAuthContext.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="mx-auto flex max-w-160 items-center gap-2 px-5 pt-12">
        home page
        <Link className="font-medium underline" to="/login">
          Login
        </Link>
      </div>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/notes',
        element: <NotePage />,
      },
      {
        path: '/notes/new',
        element: <CreateNotePage />,
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
