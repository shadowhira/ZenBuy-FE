import { fetchApi } from "./api"
import type { InventoryItem } from "@/store/seller/inventory/inventory.types"

interface InventoryResponse {
  items: InventoryItem[]
  total: number
  page: number
  limit: number
}

interface CreateInventoryItemRequest {
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  supplier: string
  notes?: string
  images: string[]
}

export const inventoryService = {
  getInventory: (page = 1, limit = 20) => fetchApi<InventoryResponse>(`/seller/inventory?page=${page}&limit=${limit}`),

  getInventoryItem: (id: string) => fetchApi<InventoryItem>(`/seller/inventory/${id}`),

  createInventoryItem: (data: CreateInventoryItemRequest) =>
    fetchApi<InventoryItem>("/seller/inventory", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateInventoryItem: (id: string, data: Partial<CreateInventoryItemRequest>) =>
    fetchApi<InventoryItem>(`/seller/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteInventoryItem: (id: string) =>
    fetchApi<{ success: boolean }>(`/seller/inventory/${id}`, {
      method: "DELETE",
    }),
}

