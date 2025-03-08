import { NextResponse } from "next/server"
import { getAuthUser } from "@lib/auth-utils"
import { getOrders, saveOrder } from "@lib/order-utils"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const orderId = params.id
    const body = await request.json()
    const { status } = body

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    // Lấy danh sách đơn hàng
    const orders = await getOrders(user.id)

    // Tìm đơn hàng
    const orderIndex = orders.findIndex((o) => o.id === orderId)

    if (orderIndex === -1) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Cập nhật trạng thái
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    // Lưu đơn hàng
    await saveOrder(user.id, orders)

    return NextResponse.json(orders[orderIndex], { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

