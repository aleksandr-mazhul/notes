import { createContext, useContext, useState } from 'react'
import type { AuthContextType, User } from '../types'

const AuthContext = createContext<AuthContextType>({
  user: null,
})

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User | null>(null)
  return (
    <AuthContext.Provider value={{ user }}> {children} </AuthContext.Provider>
  )
}
