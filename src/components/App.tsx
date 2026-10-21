import { createBrowserRouter, Link, RouterProvider } from 'react-router'
import LoginPage from '../pages/LoginPage.tsx'
import NotePage from '../pages/NotePage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        home page
        <Link to="/login">Login</Link>
      </div>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/notes',
    element: <NotePage />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
