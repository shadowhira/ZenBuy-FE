import { NextResponse } from "next/server"
import { getAuthUser } from "@lib/auth-utils"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Cập nhật thông tin người dùng
    const updatedUser = {
      ...user,
      ...body,
      // Không cho phép thay đổi role hoặc id
      id: user.id,
      role: user.role,
    }

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

