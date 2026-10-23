import { createContext, useContext, useState } from 'react'
import type { AuthContextType, User } from '../types'

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
})

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
