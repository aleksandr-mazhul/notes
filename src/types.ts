export interface Note {
  id: string
  authorId: string
  title: string
  content: string
  createdAt: Date
  hidden: boolean
  tags: string[]
}

export interface NoteDTO {
  id: string
  authorId: string
  title: string
  content: string
  createdAt: string
  hidden: boolean
  tags: string
}

export interface NoteQuery {
  where: Record<string, unknown>
  sort?: string
}

export type NoteFilter = Record<string, (query: NoteQuery) => void>

export interface User {
  id: string
  email: string
  password: string
}

export type AuthUser = Pick<User, 'id' | 'email'>

export interface AuthContextType {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
}
