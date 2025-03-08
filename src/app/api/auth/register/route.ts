import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Kiểm tra email đã tồn tại
    if (email === "user@example.com") {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 })
    }

    // Mô phỏng đăng ký thành công
    return NextResponse.json(
      {
        user: {
          id: "3",
          name,
          email,
          role: "customer",
        },
        token: "mock-jwt-token-for-new-user",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

