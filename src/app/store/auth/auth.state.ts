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
    set user(value: User | null) {
      state.user.set(value)
    },

    get isAuthenticated() {
      return state.isAuthenticated.value
    },
    set isAuthenticated(value: boolean) {
      state.isAuthenticated.set(value)
    },

    get isLoading() {
      return state.isLoading.value
    },
    set isLoading(value: boolean) {
      state.isLoading.set(value)
    },

    get error() {
      return state.error.value
    },
    set error(value: string | null) {
      state.error.set(value)
    },

    // Actions
    login: async (email: string, password: string) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sử dụng React Query hook thay vì gọi API trực tiếp
        // Đây chỉ là code tương thích ngược
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
      localStorage.removeItem("user")
      state.set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    },

    register: async (name: string, email: string, password: string) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const user: User = {
          id: "1",
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
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const user = JSON.parse(userStr) as User
          state.set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return true
        } catch (error) {
          localStorage.removeItem("user")
          state.set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
          return false
        }
      }
      return false
    },

    updateProfile: async (userData: Partial<User>) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (state.user.value) {
          const updatedUser = {
            ...state.user.value,
            ...userData,
          }

          state.user.set(updatedUser)
          state.isLoading.set(false)

          // Update in localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser))
          return true
        }
        return false
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

