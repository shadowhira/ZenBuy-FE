import { hookstate, useHookstate } from "@hookstate/core"
import type { CartState } from "./cart.types"
import { getCart, addToCart, updateCartItem, removeFromCart } from "../../../apis/cart"
import type { CartItem } from "../../../types"

// Initial state
const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
}

// Create the global state
const globalCartState = hookstate<CartState>(initialState)

// Helper function to convert immutable cart item to mutable
const convertCartItem = (item: any): CartItem => ({
  ...item,
  product: {
    ...item.product,
    category: {
      ...item.product.category,
      children: item.product.category.children ? [...item.product.category.children] : undefined
    },
    variants: item.product.variants ? [...item.product.variants] : undefined
  }
})

// Create hooks and actions
export const useCartState = () => {
  const state = useHookstate(globalCartState)

  return {
    // State với getters và setters
    get items() {
      return state.items.get().map(convertCartItem)
    },
    set items(value: CartItem[]) {
      state.items.set(value)
    },

    get isLoading() {
      return state.isLoading.get()
    },
    set isLoading(value: boolean) {
      state.isLoading.set(value)
    },

    get error() {
      return state.error.get()
    },
    set error(value: string | null) {
      state.error.set(value)
    },

    // Computed values
    get totalItems() {
      return state.items.value.reduce((total, item) => total + item.quantity, 0)
    },
    get totalPrice() {
      return state.items.value.reduce((total, item) => total + item.price * item.quantity, 0)
    },

    // Actions
    fetchCart: async () => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const cart = await getCart()
        state.items.set(cart.items)
        state.isLoading.set(false)

        return cart
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return { items: [] }
      }
    },

    addToCart: async (item: CartItem) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const cart = await addToCart(item)
        state.items.set(cart.items)
        state.isLoading.set(false)

        return cart
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return { items: [] }
      }
    },

    updateCartItem: async (itemId: string, quantity: number) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const cart = await updateCartItem({ itemId, data: { quantity } })
        state.items.set(cart.items)
        state.isLoading.set(false)

        return cart
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return { items: [] }
      }
    },

    removeFromCart: async (productId: number) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const cart = await removeFromCart(productId)
        state.items.set(cart.items)
        state.isLoading.set(false)

        return cart
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return { items: [] }
      }
    },
  }
}

