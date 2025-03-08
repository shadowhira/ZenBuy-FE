import { NextResponse } from "next/server"
import { getAuthUser } from "@lib/auth-utils"
import { getOrders } from "@lib/order-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id

    // Lấy danh sách đơn hàng
    const orders = await getOrders(user.id)

    // Tìm đơn hàng
    const order = orders.find((o) => o.id === orderId)

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

