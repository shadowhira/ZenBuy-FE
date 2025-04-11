import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AuthCheckResponse {
  authenticated: boolean
  user?: {
    _id: string
    name: string
    email: string
    role: string
  }
  message?: string
}

export function useAuthCheck() {
  const router = useRouter()

  return useQuery({
    queryKey: ["authCheck"],
    queryFn: async (): Promise<AuthCheckResponse> => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            toast.error("Session expired. Please log in again.")
            // Redirect to login after a short delay
            setTimeout(() => {
              router.push("/login")
            }, 1500)
            return { authenticated: false, message: "Not authenticated" }
          }
          throw new Error(`Auth check failed: ${response.status} ${response.statusText}`)
        }

        return await response.json()
      } catch (error) {
        console.error("Auth check error:", error)
        return { authenticated: false, message: "Error checking authentication" }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })
}
