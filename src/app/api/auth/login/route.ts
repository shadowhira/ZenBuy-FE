import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Mô phỏng xác thực
    if (email === "user@example.com" && password === "password") {
      return NextResponse.json(
        {
          user: {
            id: "1",
            name: "John Doe",
            email: "user@example.com",
            role: "customer",
            avatar: "/user-avatar.jpg",
          },
          token: "mock-jwt-token-for-testing",
        },
        { status: 200 },
      )
    } else if (email === "seller@example.com" && password === "password") {
      return NextResponse.json(
        {
          user: {
            id: "2",
            name: "Jane Smith",
            email: "seller@example.com",
            role: "seller",
            avatar: "/shop-avatar.jpg",
          },
          token: "mock-jwt-token-for-seller",
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

