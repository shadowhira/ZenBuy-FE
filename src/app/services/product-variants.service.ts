import { fetchApi } from "./api"
import type { ProductVariant } from "@/types"

interface CreateVariantRequest {
  name: string
  price: number
  stock: number
  attributes: Record<string, string>
}

interface UpdateVariantRequest {
  name?: string
  price?: number
  stock?: number
  attributes?: Record<string, string>
}

export const productVariantsService = {
  // Get all variants for a product
  getVariants: (productId: string) =>
    fetchApi<ProductVariant[]>(`/seller/products/${productId}/variants`),

  // Get a specific variant
  getVariant: (productId: string, variantId: string) =>
    fetchApi<ProductVariant>(`/seller/products/${productId}/variants/${variantId}`),

  // Create a new variant
  createVariant: (productId: string, data: CreateVariantRequest) =>
    fetchApi<ProductVariant>(`/seller/products/${productId}/variants`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update a variant
  updateVariant: (productId: string, variantId: string, data: UpdateVariantRequest) =>
    fetchApi<ProductVariant>(`/seller/products/${productId}/variants/${variantId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete a variant
  deleteVariant: (productId: string, variantId: string) =>
    fetchApi<{ success: boolean }>(`/seller/products/${productId}/variants/${variantId}`, {
      method: "DELETE",
    }),
}
