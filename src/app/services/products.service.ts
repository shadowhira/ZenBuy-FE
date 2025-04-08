import { fetchApi } from "./api"
import type { Product, ProductsResponse, ProductQueryParams } from "@/types"

export const productsService = {
  getProducts: (params: ProductQueryParams = {}) => {
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

  searchProducts: (query: string) => fetchApi<ProductsResponse>(`/products?query=${encodeURIComponent(query)}`),

  createProduct: (product: Partial<Product>) =>
    fetchApi<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),

  updateProduct: (id: string, product: Partial<Product>) =>
    fetchApi<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),

  deleteProduct: (id: string) =>
    fetchApi<{ success: boolean }>(`/products/${id}`, {
      method: "DELETE",
    }),
}

