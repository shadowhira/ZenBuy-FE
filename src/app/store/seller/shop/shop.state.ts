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
    // State
    get details() {
      return state.details.value
    },
    get isLoading() {
      return state.isLoading.value
    },
    get error() {
      return state.error.value
    },

    // Actions
    fetchShopDetails: async () => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock shop details
        const mockShopDetails: ShopDetails = {
          id: "shop-1",
          name: "Tech Haven",
          description: "Your one-stop shop for all things tech",
          bannerImage: "/shop-banner.jpg",
          avatarImage: "/shop-avatar.jpg",
          featuredProducts: ["/product1.jpg", "/product2.jpg", "/product3.jpg"],
          followers: 5678,
          rating: 4.8,
        }

        state.details.set(mockShopDetails)
        state.isLoading.set(false)

        return mockShopDetails
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

        if (state.details.value) {
          state.details.set({
            ...state.details.value,
            ...updates,
          })
          state.isLoading.set(false)

          return state.details.value
        } else {
          throw new Error("Shop details not found")
        }
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

