import { NextResponse } from "next/server"
import { z } from "zod"
import { LoginRequest, AuthResponse } from "../../types"

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // TODO: Thay thế bằng logic xác thực thực tế
    if (
      validatedData.email === "customer@example.com" &&
      validatedData.password === "password123"
    ) {
      const response: AuthResponse = {
        user: {
          id: "1",
          name: "Customer User",
          email: validatedData.email,
          role: "customer",
        },
        token: "mock-jwt-token",
      }
      return NextResponse.json(response)
    }

    if (
      validatedData.email === "seller@example.com" &&
      validatedData.password === "password123"
    ) {
      const response: AuthResponse = {
        user: {
          id: "2",
          name: "Seller User",
          email: validatedData.email,
          role: "seller",
        },
        token: "mock-jwt-token",
      }
      return NextResponse.json(response)
    }

    return NextResponse.json(
      { error: "Email hoặc mật khẩu không chính xác" },
      { status: 401 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Lỗi xác thực" },
      { status: 500 }
    )
  }
}

