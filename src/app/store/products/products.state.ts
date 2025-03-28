import { hookstate, useHookstate } from "@hookstate/core"
import type { ProductsState } from "./products.types"
import { getProducts, getProductById } from "../../../apis/products"
import type { Product, ProductQueryParams } from "../../../types"

// Initial state
const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
}

// Create the global state
const globalProductsState = hookstate<ProductsState>(initialState)

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
export const useProductsState = () => {
  const state = useHookstate(globalProductsState)

  return {
    // State với getters và setters
    get products() {
      return state.products.get().map(convertProduct)
    },
    set products(value: Product[]) {
      state.products.set(value)
    },

    get featuredProducts() {
      return state.featuredProducts.get().map(convertProduct)
    },
    set featuredProducts(value: Product[]) {
      state.featuredProducts.set(value)
    },

    get currentProduct() {
      const product = state.currentProduct.get()
      return product ? convertProduct(product) : null
    },
    set currentProduct(value: Product | null) {
      state.currentProduct.set(value)
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

    get pagination() {
      return state.pagination.get()
    },
    set pagination(value: { page: number; limit: number; total: number }) {
      state.pagination.set(value)
    },

    // Actions
    fetchProducts: async (params?: ProductQueryParams) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const response = await getProducts(params)
        state.products.set(response.products)
        state.pagination.set({
          page: response.page,
          limit: response.limit,
          total: response.total
        })
        state.isLoading.set(false)

        return response
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return { products: [], total: 0, page: 1, limit: 10 }
      }
    },

    fetchProductById: async (productId: number) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const product = await getProductById(productId)
        state.currentProduct.set(product)
        state.isLoading.set(false)

        return product
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

