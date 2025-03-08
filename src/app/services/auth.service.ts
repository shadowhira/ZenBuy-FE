import { fetchApi } from "./api"
import type { User } from "@/store/auth/auth.types"

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface RegisterResponse {
  user: User
  token: string
}

export const authService = {
  login: (data: LoginRequest) =>
    fetchApi<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) =>
    fetchApi<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProfile: () => fetchApi<User>("/auth/profile"),

  updateProfile: (data: Partial<User>) =>
    fetchApi<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  logout: () =>
    fetchApi<{ success: boolean }>("/auth/logout", {
      method: "POST",
    }),
}

