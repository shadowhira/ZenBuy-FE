export interface InventoryItem {
  id: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  supplier: string
  notes?: string
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface InventoryState {
  items: InventoryItem[]
  isLoading: boolean
  error: string | null
}

