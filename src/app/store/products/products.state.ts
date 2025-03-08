import { hookstate, useHookstate } from "@hookstate/core"
import type { ProductsState, Product } from "./products.types"

// Initial state
const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,
}

// Create the global state
const globalProductsState = hookstate<ProductsState>(initialState)

// Create hooks and actions
export const useProductsState = () => {
  const state = useHookstate(globalProductsState)

  return {
    // State với getters và setters
    get products() {
      return state.products.value
    },
    set products(value: Product[]) {
      state.products.set(value)
    },

    get featuredProducts() {
      return state.featuredProducts.value
    },
    set featuredProducts(value: Product[]) {
      state.featuredProducts.set(value)
    },

    get currentProduct() {
      return state.currentProduct.value
    },
    set currentProduct(value: Product | null) {
      state.currentProduct.set(value)
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
    fetchProducts: async (category?: string) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock products data
        const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
          id: `product-${i + 1}`,
          name: `Product ${i + 1}`,
          description: `Description for Product ${i + 1}`,
          price: Math.floor(Math.random() * 100) + 10,
          images: [`/product${(i % 8) + 1}.jpg`],
          category: category || "Electronics",
          rating: Math.floor(Math.random() * 5) + 1,
          reviews: Math.floor(Math.random() * 100),
          shopId: "shop-1",
          shopName: "Tech Store",
        }))

        state.products.set(mockProducts)
        state.isLoading.set(false)

        return mockProducts
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return []
      }
    },

    fetchFeaturedProducts: async () => {
      try {
        state.isLoading.set(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock featured products data
        const mockFeaturedProducts: Product[] = Array.from({ length: 8 }, (_, i) => ({
          id: `featured-${i + 1}`,
          name: `Featured Product ${i + 1}`,
          description: `Description for Featured Product ${i + 1}`,
          price: Math.floor(Math.random() * 100) + 50,
          images: [`/product${(i % 8) + 1}.jpg`],
          category: "Featured",
          rating: Math.floor(Math.random() * 5) + 3,
          reviews: Math.floor(Math.random() * 200) + 50,
          shopId: "shop-1",
          shopName: "Tech Store",
        }))

        state.featuredProducts.set(mockFeaturedProducts)
        state.isLoading.set(false)

        return mockFeaturedProducts
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return []
      }
    },

    fetchProductById: async (productId: string) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock product data
        const mockProduct: Product = {
          id: productId,
          name: `Product ${productId}`,
          description: `This is a detailed description for Product ${productId}. It includes information about the product features, specifications, and usage.`,
          price: Math.floor(Math.random() * 100) + 50,
          images: Array.from({ length: 4 }, (_, i) => `/product${(i % 8) + 1}.jpg`),
          category: "Electronics",
          subcategory: "Smartphones",
          rating: 4.5,
          reviews: 120,
          shopId: "shop-1",
          shopName: "Tech Store",
        }

        state.currentProduct.set(mockProduct)
        state.isLoading.set(false)

        return mockProduct
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },

    searchProducts: async (query: string) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock search results
        const mockSearchResults: Product[] = Array.from({ length: 12 }, (_, i) => ({
          id: `search-${i + 1}`,
          name: `${query} Product ${i + 1}`,
          description: `Description for ${query} Product ${i + 1}`,
          price: Math.floor(Math.random() * 100) + 20,
          images: [`/product${(i % 8) + 1}.jpg`],
          category: "Search Results",
          rating: Math.floor(Math.random() * 5) + 1,
          reviews: Math.floor(Math.random() * 100),
          shopId: "shop-1",
          shopName: "Tech Store",
        }))

        state.products.set(mockSearchResults)
        state.isLoading.set(false)

        return mockSearchResults
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

