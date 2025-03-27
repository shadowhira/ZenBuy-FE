import { NextResponse } from "next/server"
import { getAuthUser } from "@lib/auth-utils"
import { getCart, saveCart } from "@lib/cart-utils"
import { CartResponse, Cart } from "../types"
import { z } from "zod"

const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
  variant: z.string().optional(),
})

const updateCartSchema = z.object({
  items: z.array(cartItemSchema),
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

    const cart = await getCart(user.id)

    const response: CartResponse = {
      items: cart.items,
      totalItems: cart.items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: cart.items.reduce((total, item) => total + item.price * item.quantity, 0),
    }
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy giỏ hàng" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateCartSchema.parse(body)

    const cart: Cart = {
      items: validatedData.items,
    }

    await saveCart(user.id, cart)

    return NextResponse.json({ message: "Cập nhật giỏ hàng thành công" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Lỗi cập nhật giỏ hàng" },
      { status: 500 }
    )
  }
}

