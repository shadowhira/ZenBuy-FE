import { NextResponse } from "next/server"
import { getAuthUser } from "@lib/auth-utils"
import { getOrders, saveOrder } from "@lib/order-utils"
import { saveCart } from "@lib/cart-utils"
import { OrdersResponse, CreateOrderRequest, Order } from "../types"
import { z } from "zod"

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
})

const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
})

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  city: z.string().min(2, "Thành phố phải có ít nhất 2 ký tự"),
  state: z.string().min(2, "Tỉnh/Thành phố phải có ít nhất 2 ký tự"),
  country: z.string().min(2, "Quốc gia phải có ít nhất 2 ký tự"),
  zipCode: z.string().min(5, "Mã bưu điện phải có ít nhất 5 ký tự"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Giỏ hàng không được trống"),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["credit_card", "bank_transfer", "cash"]),
})

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const validatedParams = querySchema.parse(Object.fromEntries(searchParams))

    // Lấy danh sách đơn hàng
    const orders = await getOrders(user.id)

    // Phân trang
    const startIndex = (validatedParams.page - 1) * validatedParams.limit
    const endIndex = startIndex + validatedParams.limit
    const paginatedOrders = orders.slice(startIndex, endIndex)

    const response: OrdersResponse = {
      orders: paginatedOrders,
      total: orders.length,
      page: validatedParams.page,
      limit: validatedParams.limit,
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
      { error: "Lỗi lấy danh sách đơn hàng" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    // Tính tổng tiền
    const totalAmount = validatedData.items.reduce((total: number, item: any) => total + item.price * item.quantity, 0)

    // Tạo đơn hàng mới
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: user.id,
      items: validatedData.items,
      totalAmount,
      status: "pending",
      shippingAddress: validatedData.shippingAddress,
      paymentMethod: validatedData.paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Lấy danh sách đơn hàng hiện tại
    const orders = await getOrders(user.id)
    // Thêm đơn hàng mới vào danh sách
    orders.push(newOrder)
    // Lưu danh sách đơn hàng
    await saveOrder(user.id, orders)

    // Xóa giỏ hàng
    await saveCart(user.id, { items: [] })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Lỗi tạo đơn hàng" },
      { status: 500 }
    )
  }
}

