import type { CartItem } from "@/store/cart/cart.types"

interface Cart {
  items: CartItem[]
}

// Mô phỏng lưu trữ giỏ hàng
const cartStorage = new Map<string, Cart>()

export async function getCart(userId: string): Promise<Cart> {
  // Lấy giỏ hàng từ storage
  const cart = cartStorage.get(userId)

  // Nếu không có giỏ hàng, tạo giỏ hàng mới
  if (!cart) {
    return { items: [] }
  }

  return cart
}

export async function saveCart(userId: string, cart: Cart): Promise<void> {
  // Lưu giỏ hàng vào storage
  cartStorage.set(userId, cart)
}

