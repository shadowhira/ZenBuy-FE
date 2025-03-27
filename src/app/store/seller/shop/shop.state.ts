import { hookstate, useHookstate } from "@hookstate/core"
import type { ShopState } from "./shop.types"
import { getShopById, updateShop } from "../../../../apis/shops"
import type { Shop, Product } from "../../../../types"

// Initial state
const initialState: ShopState = {
  details: null,
  isLoading: false,
  error: null,
}

// Create the global state
const globalShopState = hookstate<ShopState>(initialState)

// Helper function to convert immutable product to mutable
const convertProduct = (product: any): Product => ({
  ...product,
  category: {
    ...product.category,
    children: product.category.children ? [...product.category.children] : undefined
  },
  variants: product.variants ? [...product.variants] : undefined
})

// Create hooks and actions
export const useShopState = () => {
  const state = useHookstate(globalShopState)

  return {
    // State với getters và setters
    get details() {
      const shop = state.details.get()
      if (!shop) return null
      return {
        ...shop,
        products: shop.products.map(convertProduct)
      }
    },
    set details(value: Shop | null) {
      state.details.set(value)
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

    // Actions
    fetchShopDetails: async (shopId: number) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const shop = await getShopById(shopId)
        state.details.set(shop)
        state.isLoading.set(false)

        return shop
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },

    updateShopDetails: async (shopId: number, updates: Partial<Shop>) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        if (!state.details.get()) {
          throw new Error("Shop details not found")
        }

        const updatedShop = await updateShop(shopId, updates)
        state.details.set(updatedShop)
        state.isLoading.set(false)

        return updatedShop
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },
  }
}

