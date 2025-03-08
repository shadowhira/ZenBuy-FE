import { fetchApi } from "./api"
import type { CartItem } from "@/store/cart/cart.types"

interface CartResponse {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

interface AddToCartRequest {
  productId: string
  quantity: number
  variant?: string
}

interface UpdateCartItemRequest {
  quantity: number
}

export const cartService = {
  getCart: () => fetchApi<CartResponse>("/cart"),

  addToCart: (data: AddToCartRequest) =>
    fetchApi<CartResponse>("/cart/items", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCartItem: (itemId: string, data: UpdateCartItemRequest) =>
    fetchApi<CartResponse>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  removeCartItem: (itemId: string) =>
    fetchApi<CartResponse>(`/cart/items/${itemId}`, {
      method: "DELETE",
    }),

  clearCart: () =>
    fetchApi<{ success: boolean }>("/cart/clear", {
      method: "POST",
    }),
}

