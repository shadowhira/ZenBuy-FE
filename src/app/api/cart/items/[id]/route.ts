import { NextResponse } from "next/server"
import { z } from "zod"
import { getAuthUser } from "@lib/auth-utils"
import { getCart, saveCart } from "@lib/cart-utils"
import { Cart } from "../../../types"
import { handleError } from "../../../error"
import { logger } from "@lib/logger"

const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
})

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = updateCartItemSchema.parse(body)

    // Lấy giỏ hàng
    const cart = await getCart(user.id)

    // Tìm sản phẩm cần cập nhật
    const itemIndex = cart.items.findIndex((item) => item.id === params.id)

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm trong giỏ hàng" },
        { status: 404 }
      )
    }

    // Cập nhật số lượng sản phẩm
    cart.items[itemIndex] = {
      ...cart.items[itemIndex],
      quantity: validatedData.quantity,
    }

    await saveCart(user.id, cart)

    logger.info(
      `Cập nhật số lượng sản phẩm ${params.id} thành ${validatedData.quantity}`
    )

    return NextResponse.json(cart)
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    // Lấy giỏ hàng
    const cart = await getCart(user.id)

    // Tìm sản phẩm cần xóa
    const itemIndex = cart.items.findIndex((item) => item.id === params.id)

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm trong giỏ hàng" },
        { status: 404 }
      )
    }

    // Xóa sản phẩm
    cart.items.splice(itemIndex, 1)
    await saveCart(user.id, cart)

    logger.info(`Xóa sản phẩm ${params.id} khỏi giỏ hàng`)

    return NextResponse.json(cart)
  } catch (error) {
    return handleError(error)
  }
}

