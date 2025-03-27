import { NextResponse } from "next/server"
import { z } from "zod"
import { RegisterRequest, AuthResponse } from "../../types"

const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Kiểm tra email đã tồn tại
    if (validatedData.email === "customer@example.com") {
      return NextResponse.json({ error: "Email đã được sử dụng" }, { status: 400 })
    }

    const response: AuthResponse = {
      user: {
        id: "3",
        name: validatedData.name,
        email: validatedData.email,
        role: "customer",
      },
      token: "mock-jwt-token",
    }
    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Lỗi đăng ký" },
      { status: 500 }
    )
  }
}

