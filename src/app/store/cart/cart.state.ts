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
    // State với getters và setters
    get items() {
      return state.items.value
    },
    set items(value: CartItem[]) {
      state.items.set(value)
    },

    get isLoading() {
      return state.isLoading.value
    },
    set isLoading(value: boolean) {
      state.isLoading.set(value)
    },

    get error() {
      return state.error.value
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
    addToCart: (item: Omit<CartItem, "id">) => {
      const existingItemIndex = state.items.value.findIndex(
        (cartItem) => cartItem.productId === item.productId && cartItem.variant === item.variant,
      )

      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const newItems = [...state.items.value]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + item.quantity,
        }
        state.items.set(newItems)
      } else {
        // Add new item
        const newItem: CartItem = {
          ...item,
          id: `cart-item-${Date.now()}`,
        }
        state.items.set([...state.items.value, newItem])
      }
    },

    updateCartItem: (id: string, quantity: number) => {
      const itemIndex = state.items.value.findIndex((item) => item.id === id)
      if (itemIndex >= 0) {
        const newItems = [...state.items.value]
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          quantity,
        }
        state.items.set(newItems)
      }
    },

    removeCartItem: (id: string) => {
      state.items.set(state.items.value.filter((item) => item.id !== id))
    },

    clearCart: () => {
      state.items.set([])
    },

    fetchCart: async () => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock cart data
        const mockCartItems: CartItem[] = [
          {
            id: "cart-1",
            productId: "product-1",
            name: "Product 1",
            price: 19.99,
            quantity: 2,
            image: "/product1.jpg",
            variant: "Red",
          },
          {
            id: "cart-2",
            productId: "product-2",
            name: "Product 2",
            price: 29.99,
            quantity: 1,
            image: "/product2.jpg",
          },
        ]

        state.items.set(mockCartItems)
        state.isLoading.set(false)

        return mockCartItems
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return []
      }
    },
  }
}

