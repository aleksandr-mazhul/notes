import { createContext, useContext } from 'react'
import type { AuthContextType } from '../types'

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
})

export const useAuthContext = () => useContext(AuthContext)
