import { hookstate, useHookstate } from "@hookstate/core"
import type { AuthState, User } from "./auth.types"

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Create the global state
const globalAuthState = hookstate<AuthState>(initialState)

// Create hooks and actions
export const useAuthState = () => {
  const state = useHookstate(globalAuthState)

  return {
    // State
    get user() {
      return state.user.value
    },
    get isAuthenticated() {
      return state.isAuthenticated.value
    },
    get isLoading() {
      return state.isLoading.value
    },
    get error() {
      return state.error.value
    },

    // Actions
    login: async (email: string, password: string) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock successful login
        if (email === "user@example.com" && password === "password") {
          const user: User = {
            id: "1",
            name: "John Doe",
            email: "user@example.com",
            role: "customer",
          }

          state.set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          // Store in localStorage
          localStorage.setItem("user", JSON.stringify(user))
          return true
        } else {
          state.set({
            ...state.value,
            error: "Invalid email or password",
            isLoading: false,
          })
          return false
        }
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return false
      }
    },

    logout: () => {
      state.set({
        ...state.value,
        user: null,
        isAuthenticated: false,
      })
      localStorage.removeItem("user")
    },

    register: async (name: string, email: string, password: string) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock successful registration
        const user: User = {
          id: Date.now().toString(),
          name,
          email,
          role: "customer",
        }

        state.set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(user))
        return true
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return false
      }
    },

    checkAuth: () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser) as User
          state.set({
            ...state.value,
            user,
            isAuthenticated: true,
          })
        } catch (error) {
          localStorage.removeItem("user")
        }
      }
    },

    updateProfile: async (userData: Partial<User>) => {
      try {
        state.isLoading.set(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (state.user.value) {
          state.user.set({
            ...state.user.value,
            ...userData,
          })
        }

        state.isLoading.set(false)

        // Update localStorage
        const updatedUser = state.user.value
        if (updatedUser) {
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }

        return true
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return false
      }
    },
  }
}

