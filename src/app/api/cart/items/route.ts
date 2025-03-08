import { NextResponse } from "next/server"
import { getAuthUser } from "@lib/auth-utils"
import { getCart, saveCart } from "@lib/cart-utils"
import { generateMockProducts } from "@lib/mock-data"

export async function POST(request: Request) {
  try {
    const user = await getAuthUser(request)

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { productId, quantity, variant } = body

    // Kiểm tra sản phẩm tồn tại
    const products = generateMockProducts(40)
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Lấy giỏ hàng hiện tại
    const cart = await getCart(user.id)

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.items.findIndex((item) => item.productId === productId && item.variant === variant)

    if (existingItemIndex >= 0) {
      // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Thêm sản phẩm mới vào giỏ hàng
      cart.items.push({
        id: `cart-item-${Date.now()}`,
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
        variant,
      })
    }

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

