import { NextResponse } from "next/server"
import { headers } from 'next/headers'

export async function POST() {
  try {
    const headersList = await headers()
    const token = headersList.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực" },
        { status: 401 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || "Lỗi đăng xuất" },
        { status: response.status }
      )
    }

    return NextResponse.json({ message: "Đăng xuất thành công" })
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi đăng xuất" },
      { status: 500 }
    )
  }
}

