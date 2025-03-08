import { NextResponse } from "next/server"
import { getAuthUser } from "@lib/auth-utils"
import { getOrders, saveOrder } from "@lib/order-utils"
import { saveCart } from "@lib/cart-utils"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Lấy danh sách đơn hàng
    const orders = await getOrders(user.id)

    // Phân trang
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = orders.slice(startIndex, endIndex)

    return NextResponse.json(
      {
        orders: paginatedOrders,
        total: orders.length,
        page,
        limit,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddress, paymentMethod } = body

    // Tính tổng tiền
    const totalAmount = items.reduce((total: number, item: any) => total + item.price * item.quantity, 0)

    // Tạo đơn hàng mới
    const newOrder = {
      id: `order-${Date.now()}`,
      userId: user.id,
      items,
      totalAmount,
      status: "pending",
      shippingAddress,
      paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Lưu đơn hàng
    const orders = await getOrders(user.id)
    orders.push(newOrder)
    await saveOrder(user.id, orders)

    // Xóa giỏ hàng sau khi đặt hàng
    await saveCart(user.id, { items: [] })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

