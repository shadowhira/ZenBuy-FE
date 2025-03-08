import { NextResponse } from "next/server"
import { getAuthUser } from "@lib/auth-utils"
import { saveCart } from "@lib/cart-utils"

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Xóa giỏ hàng
    await saveCart(user.id, { items: [] })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

