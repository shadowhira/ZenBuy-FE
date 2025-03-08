import { NextResponse } from "next/server"
import { getAuthUser } from "@lib/auth-utils"
import { getCart } from "@lib/cart-utils"

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const cart = await getCart(user.id)

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

