import { hookstate, useHookstate } from "@hookstate/core"
import type { ShopState, ShopDetails } from "./shop.types"

// Initial state
const initialState: ShopState = {
  details: null,
  isLoading: false,
  error: null,
}

// Create the global state
const globalShopState = hookstate<ShopState>(initialState)

// Create hooks and actions
export const useShopState = () => {
  const state = useHookstate(globalShopState)

  return {
    // State với getters và setters
    get details() {
      return state.details.value
    },
    set details(value: ShopDetails | null) {
      state.details.set(value)
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

    // Actions
    fetchShopDetails: async () => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock shop data
        const mockShop: ShopDetails = {
          id: "shop-1",
          name: "Tech Store",
          description: "Your one-stop shop for all tech needs",
          bannerImage: "/shop-banner.jpg",
          avatarImage: "/shop-avatar.jpg",
          featuredProducts: ["/product1.jpg", "/product2.jpg", "/product3.jpg"],
          followers: 1234,
          rating: 4.8,
        }

        state.details.set(mockShop)
        state.isLoading.set(false)

        return mockShop
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },

    updateShopDetails: async (updates: Partial<Omit<ShopDetails, "id">>) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (!state.details.value) {
          throw new Error("Shop details not found")
        }

        const updatedShop: ShopDetails = {
          ...state.details.value,
          ...updates,
        }

        state.details.set(updatedShop)
        state.isLoading.set(false)

        return updatedShop
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },
  }
}

