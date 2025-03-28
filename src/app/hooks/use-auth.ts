import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { authService } from "@services/auth.service"
import { useAuthState } from "@store/auth/auth.state"
import type { User } from "../../types"
import { queryClient } from "@services/query-client"

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  user: User
  token: string
}

export function useLogin() {
  const authState = useAuthState()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Lưu token vào localStorage
      localStorage.setItem("token", data.token)

      // Cập nhật state trong Hookstate
      authState.user = data.user
      authState.isAuthenticated = true
      authState.error = null

      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] })
    },
    onError: (error) => {
      authState.error = error instanceof Error ? error.message : "Login failed"
    },
  })
}

export function useRegister() {
  const authState = useAuthState()

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Lưu token vào localStorage
      localStorage.setItem("token", data.token)

      // Cập nhật state trong Hookstate
      authState.user = data.user
      authState.isAuthenticated = true
      authState.error = null

      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] })
    },
    onError: (error) => {
      authState.error = error instanceof Error ? error.message : "Registration failed"
    },
  })
}

export function useLogout() {
  const authState = useAuthState()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Xóa token từ localStorage
      localStorage.removeItem("token")

      // Cập nhật state trong Hookstate
      authState.user = null
      authState.isAuthenticated = false

      // Reset các queries liên quan
      queryClient.clear()
    },
  })
}

export function useProfile() {
  const authState = useAuthState()
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("token")

  const query = useSuspenseQuery({
    queryKey: ["auth", "profile"],
    queryFn: authService.getProfile,
    gcTime: 1000 * 60 * 60, // 1 hour
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      // Cập nhật state trong Hookstate
      authState.user = data
      authState.isAuthenticated = true
      return data
    },
  })

  // Xử lý lỗi nếu cần
  if (query.error) {
    authState.user = null
    authState.isAuthenticated = false
    localStorage.removeItem("token")
  }

  return query
}

export function useUpdateProfile() {
  const authState = useAuthState()

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      // Cập nhật state trong Hookstate
      authState.user = data

      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] })
    },
  })
}

