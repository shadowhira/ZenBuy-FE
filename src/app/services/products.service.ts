import { fetchApi } from "./api"
import type { Product } from "@/store/products/products.types"

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
}

interface ProductSearchParams {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  sort?: string
}

export const productsService = {
  getProducts: (params: ProductSearchParams = {}) => {
    const queryParams = new URLSearchParams()

    // Add all params to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    return fetchApi<ProductsResponse>(`/products?${queryParams.toString()}`)
  },

  getProductById: (id: string) => fetchApi<Product>(`/products/${id}`),

  getFeaturedProducts: () => fetchApi<Product[]>("/products/featured"),

  searchProducts: (query: string) => fetchApi<ProductsResponse>(`/products/search?query=${encodeURIComponent(query)}`),
}

