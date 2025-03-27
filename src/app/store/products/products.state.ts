import { hookstate, useHookstate } from "@hookstate/core"
import type { ProductsState } from "./products.types"
import { getProducts, getProductById } from "../../../apis/products"
import type { Product } from "../../../types"

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

    // Actions
    fetchProducts: async (params?: {
      page?: number;
      limit?: number;
      category?: number;
      search?: string;
      sort?: string;
    }) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const { products, total } = await getProducts(params)
        state.products.set(products)
        state.isLoading.set(false)

        return { products, total }
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return { products: [], total: 0 }
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

