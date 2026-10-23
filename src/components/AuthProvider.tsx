import { useState } from 'react'
import type { User } from '../types'
import { AuthContext } from '../hooks/useAuthContext.tsx'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('user')!) || null
    } catch {
      return null
    }
  })
  const handleUserChange = (newUser: User | null) => {
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  return (
    <AuthContext.Provider value={{ user, setUser: handleUserChange }}>
      {children}
    </AuthContext.Provider>
  )
}
