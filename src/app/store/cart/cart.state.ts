import { hookstate, useHookstate } from "@hookstate/core"
import type { CartState, CartItem } from "./cart.types"

// Initial state
const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
}

// Create the global state
const globalCartState = hookstate<CartState>(initialState)

// Create hooks and actions
export const useCartState = () => {
  const state = useHookstate(globalCartState)

  return {
    // State
    get items() {
      return state.items.value
    },
    get isLoading() {
      return state.isLoading.value
    },
    get error() {
      return state.error.value
    },

    // Computed values
    get totalItems() {
      return state.items.value.reduce((total, item) => total + item.quantity, 0)
    },
    get totalPrice() {
      return state.items.value.reduce((total, item) => total + item.price * item.quantity, 0)
    },

    // Actions
    addItem: (item: Omit<CartItem, "id">) => {
      const existingItemIndex = state.items.value.findIndex(
        (i) => i.productId === item.productId && i.variant === item.variant,
      )

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const newQuantity = state.items[existingItemIndex].quantity.value + item.quantity
        state.items[existingItemIndex].quantity.set(newQuantity)
      } else {
        // Add new item
        const newItem: CartItem = {
          ...item,
          id: Date.now().toString(),
        }
        state.items.set([...state.items.value, newItem])
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items.value))
    },

    updateQuantity: (itemId: string, quantity: number) => {
      const itemIndex = state.items.value.findIndex((i) => i.id === itemId)
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          const newItems = state.items.value.filter((item) => item.id !== itemId)
          state.items.set(newItems)
        } else {
          // Update quantity
          state.items[itemIndex].quantity.set(quantity)
        }

        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(state.items.value))
      }
    },

    removeItem: (itemId: string) => {
      const newItems = state.items.value.filter((item) => item.id !== itemId)
      state.items.set(newItems)

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items.value))
    },

    clearCart: () => {
      state.items.set([])
      localStorage.removeItem("cart")
    },

    loadCart: () => {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        try {
          const items = JSON.parse(storedCart) as CartItem[]
          state.items.set(items)
        } catch (error) {
          localStorage.removeItem("cart")
        }
      }
    },
  }
}

