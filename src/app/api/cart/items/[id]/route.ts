import { NextResponse } from "next/server"
import { getAuthUser } from "@lib/auth-utils"
import { getCart, saveCart } from "@lib/cart-utils"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const itemId = params.id
    const body = await request.json()
    const { quantity } = body

    // Lấy giỏ hàng hiện tại
    const cart = await getCart(user.id)

    // Tìm sản phẩm trong giỏ hàng
    const itemIndex = cart.items.findIndex((item) => item.id === itemId)

    if (itemIndex === -1) {
      return NextResponse.json({ message: "Item not found in cart" }, { status: 404 })
    }

    // Cập nhật số lượng
    cart.items[itemIndex].quantity = quantity

    // Lưu giỏ hàng
    await saveCart(user.id, cart)

    return NextResponse.json(
      {
        items: cart.items,
        totalItems: cart.items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: cart.items.reduce((total, item) => total + item.price * item.quantity, 0),
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const itemId = params.id

    // Lấy giỏ hàng hiện tại
    const cart = await getCart(user.id)

    // Xóa sản phẩm khỏi giỏ hàng
    cart.items = cart.items.filter((item) => item.id !== itemId)

    // Lưu giỏ hàng
    await saveCart(user.id, cart)

    return NextResponse.json(
      {
        items: cart.items,
        totalItems: cart.items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: cart.items.reduce((total, item) => total + item.price * item.quantity, 0),
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

