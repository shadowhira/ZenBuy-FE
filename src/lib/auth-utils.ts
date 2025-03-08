import { cookies } from "next/headers"
import type { User } from "@store/auth/auth.types"

// Mô phỏng xác thực từ token
export async function getAuthUser(request: Request): Promise<User | null> {
  // Lấy token từ Authorization header
  const authHeader = request.headers.get("Authorization")
  let token = authHeader ? authHeader.replace("Bearer ", "") : null

  // Nếu không có token trong header, thử lấy từ cookie
  if (!token) {
    const cookieStore = await cookies()
    token = cookieStore.get("token")?.value ?? null
  }

  if (!token) {
    return null
  }

  // Mô phỏng xác thực token
  if (token === "mock-jwt-token-for-testing") {
    return {
      id: "1",
      name: "John Doe",
      email: "user@example.com",
      role: "customer",
      avatar: "/user-avatar.jpg",
    }
  } else if (token === "mock-jwt-token-for-seller") {
    return {
      id: "2",
      name: "Jane Smith",
      email: "seller@example.com",
      role: "seller",
      avatar: "/shop-avatar.jpg",
    }
  } else if (token === "mock-jwt-token-for-new-user") {
    return {
      id: "3",
      name: "New User",
      email: "newuser@example.com",
      role: "customer",
    }
  }

  return null
}

