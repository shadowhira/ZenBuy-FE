export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "customer" | "seller" | "admin"
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

