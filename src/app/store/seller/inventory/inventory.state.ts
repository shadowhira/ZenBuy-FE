import { hookstate, useHookstate } from "@hookstate/core"
import type { InventoryState, InventoryItem } from "./inventory.types"

// Initial state
const initialState: InventoryState = {
  items: [],
  isLoading: false,
  error: null,
}

// Create the global state
const globalInventoryState = hookstate<InventoryState>(initialState)

// Create hooks and actions
export const useInventoryState = () => {
  const state = useHookstate(globalInventoryState)

  return {
    // State với getters và setters
    get items() {
      return state.items.value
    },
    set items(value: InventoryItem[]) {
      state.items.set(value)
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

    // Computed values
    get totalItems() {
      return state.items.value.length
    },
    get totalValue() {
      return state.items.value.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
    },
    get lowStockItems() {
      return state.items.value.filter((item) => item.quantity < 10)
    },

    // Actions
    fetchInventory: async () => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock inventory data
        const mockInventory: InventoryItem[] = Array.from({ length: 15 }, (_, i) => ({
          id: `inv-${i + 1}`,
          productName: `Product ${i + 1}`,
          sku: `SKU-${1000 + i}`,
          quantity: Math.floor(Math.random() * 100) + 1,
          unitPrice: Math.floor(Math.random() * 100) + 10,
          supplier: `Supplier ${(i % 5) + 1}`,
          notes: i % 3 === 0 ? `Notes for product ${i + 1}` : undefined,
          images: [`/product${(i % 8) + 1}.jpg`],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          updatedAt: new Date().toISOString(),
        }))

        state.items.set(mockInventory)
        state.isLoading.set(false)

        return mockInventory
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return []
      }
    },

    addInventoryItem: async (item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newItem: InventoryItem = {
          ...item,
          id: `inv-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        state.items.set([...state.items.value, newItem])
        state.isLoading.set(false)

        return newItem
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },

    updateInventoryItem: async (
      id: string,
      updates: Partial<Omit<InventoryItem, "id" | "createdAt" | "updatedAt">>,
    ) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const itemIndex = state.items.value.findIndex((item) => item.id === id)
        if (itemIndex >= 0) {
          const updatedItem = {
            ...state.items[itemIndex].value,
            ...updates,
            updatedAt: new Date().toISOString(),
          }

          const newItems = [...state.items.value]
          newItems[itemIndex] = updatedItem

          state.items.set(newItems)
          state.isLoading.set(false)

          return updatedItem
        } else {
          throw new Error("Inventory item not found")
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

    deleteInventoryItem: async (id: string) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newItems = state.items.value.filter((item) => item.id !== id)
        state.items.set(newItems)
        state.isLoading.set(false)

        return true
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return false
      }
    },

    scanQRCode: async (qrData: string) => {
      try {
        // Parse QR data
        const parsedData = JSON.parse(qrData)

        // Create inventory item from QR data
        const newItem: Omit<InventoryItem, "id" | "createdAt" | "updatedAt"> = {
          productName: parsedData.productName || "",
          sku: parsedData.sku || "",
          quantity: Number.parseInt(parsedData.quantity) || 1,
          unitPrice: Number.parseFloat(parsedData.unitPrice) || 0,
          supplier: parsedData.supplier || "",
          notes: parsedData.notes,
          images: [],
        }

        // Add to inventory
        return await this.addInventoryItem(newItem)
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

