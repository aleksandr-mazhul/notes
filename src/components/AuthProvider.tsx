import { skipToken, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'
import { AuthContext } from '../hooks/useAuthContext.tsx'

const currentUserQueryKey = ['auth', 'user'] as const

function readStoredUser() {
  try {
    const storedUser: unknown = JSON.parse(
      localStorage.getItem('user') ?? 'null',
    )
    if (
      storedUser &&
      typeof storedUser === 'object' &&
      'id' in storedUser &&
      typeof storedUser.id === 'string' &&
      'email' in storedUser &&
      typeof storedUser.email === 'string'
    ) {
      return { id: storedUser.id, email: storedUser.email }
    }
  } catch {
    return null
  }

  return null
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { data: user = null } = useQuery({
    queryKey: currentUserQueryKey,
    queryFn: skipToken,
    initialData: readStoredUser,
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    } catch {
      return
    }
  }, [user])

  const handleUserChange = (newUser: typeof user) => {
    const currentUser = newUser && { id: newUser.id, email: newUser.email }
    queryClient.setQueryData(currentUserQueryKey, currentUser)
  }

  return (
    <AuthContext.Provider value={{ user, setUser: handleUserChange }}>
      {children}
    </AuthContext.Provider>
  )
}
