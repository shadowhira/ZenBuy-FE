import { NextResponse } from "next/server"
import { z } from "zod"
import { getAuthUser } from "@lib/auth-utils"
import { getOrders, saveOrder } from "@lib/order-utils"
import { Order } from "../../types"
import { handleError } from "@/lib/error"
import { logger } from "@lib/logger"

const updateOrderSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    // Lấy danh sách đơn hàng
    const orders = await getOrders(user.id)

    // Tìm đơn hàng cần lấy
    const order = orders.find((order) => order.id === params.id)

    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      )
    }

    logger.info(`Lấy chi tiết đơn hàng ${params.id}`)
    return NextResponse.json(order)
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateOrderSchema.parse(body)

    // Lấy danh sách đơn hàng
    const orders = await getOrders(user.id)

    // Tìm đơn hàng cần cập nhật
    const orderIndex = orders.findIndex((order) => order.id === params.id)

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      )
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder: Order = {
      ...orders[orderIndex],
      status: validatedData.status,
      updatedAt: new Date().toISOString(),
    }

    orders[orderIndex] = updatedOrder
    await saveOrder(user.id, orders)

    logger.info(`Cập nhật trạng thái đơn hàng ${params.id} thành ${validatedData.status}`)

    return NextResponse.json(updatedOrder)
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    // Lấy danh sách đơn hàng
    const orders = await getOrders(user.id)

    // Tìm đơn hàng cần xóa
    const orderIndex = orders.findIndex((order) => order.id === params.id)

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      )
    }

    // Xóa đơn hàng
    orders.splice(orderIndex, 1)
    await saveOrder(user.id, orders)

    logger.info(`Xóa đơn hàng ${params.id}`)

    return NextResponse.json({ message: "Xóa đơn hàng thành công" })
  } catch (error) {
    return handleError(error)
  }
}

