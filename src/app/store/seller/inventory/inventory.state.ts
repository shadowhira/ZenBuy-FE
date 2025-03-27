import { hookstate, useHookstate } from "@hookstate/core"
import type { InventoryState } from "./inventory.types"
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from "../../../../apis/inventory"
import type { InventoryItem } from "../../../../types"

// Initial state
const initialState: InventoryState = {
  items: [],
  isLoading: false,
  error: null,
}

// Create the global state
const globalInventoryState = hookstate<InventoryState>(initialState)

// Helper function to convert immutable inventory item to mutable
const convertInventoryItem = (item: any): InventoryItem => ({
  ...item,
  images: item.images ? [...item.images] : []
})

// Create hooks and actions
export const useInventoryState = () => {
  const state = useHookstate(globalInventoryState)

  return {
    // State với getters và setters
    get items() {
      return state.items.get().map(convertInventoryItem)
    },
    set items(value: InventoryItem[]) {
      state.items.set(value)
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

    // Computed values
    get totalItems() {
      return state.items.get().length
    },
    get totalValue() {
      return state.items.get().reduce((total, item) => total + item.unitPrice * item.quantity, 0)
    },
    get lowStockItems() {
      return state.items.get().filter((item) => item.quantity < 10)
    },

    // Actions
    fetchInventory: async () => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const items = await getInventory()
        state.items.set(items)
        state.isLoading.set(false)

        return items
      } catch (error) {
        state.set({
          ...state.get(),
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

        const newItem = await addInventoryItem(item)
        state.items.set([...state.items.get(), newItem])
        state.isLoading.set(false)

        return newItem
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },

    updateInventoryItem: async (id: string, updates: Partial<Omit<InventoryItem, "id" | "createdAt" | "updatedAt">>) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const updatedItem = await updateInventoryItem(id, updates)
        state.items.set(state.items.get().map(item => item.id === id ? updatedItem : item))
        state.isLoading.set(false)

        return updatedItem
      } catch (error) {
        state.set({
          ...state.get(),
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

        await deleteInventoryItem(id)
        state.items.set(state.items.get().filter(item => item.id !== id))
        state.isLoading.set(false)

        return true
      } catch (error) {
        state.set({
          ...state.get(),
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
        return await addInventoryItem(newItem)
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

