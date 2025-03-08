import { hookstate, useHookstate } from "@hookstate/core"
import type { OrdersState, Order } from "./orders.types"

// Initial state
const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
}

// Create the global state
const globalOrdersState = hookstate<OrdersState>(initialState)

// Create hooks and actions
export const useOrdersState = () => {
  const state = useHookstate(globalOrdersState)

  return {
    // State
    get orders() {
      return state.orders.value
    },
    get currentOrder() {
      return state.currentOrder.value
    },
    get isLoading() {
      return state.isLoading.value
    },
    get error() {
      return state.error.value
    },

    // Computed values
    get pendingOrders() {
      return state.orders.value.filter((order) => order.status === "pending")
    },
    get processingOrders() {
      return state.orders.value.filter((order) => order.status === "processing")
    },
    get shippedOrders() {
      return state.orders.value.filter((order) => order.status === "shipped")
    },
    get deliveredOrders() {
      return state.orders.value.filter((order) => order.status === "delivered")
    },

    // Actions
    fetchOrders: async () => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock orders data
        const mockOrders: Order[] = Array.from({ length: 10 }, (_, i) => ({
          id: `order-${i + 1}`,
          userId: "user-1",
          items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
            productId: `product-${j + 1}`,
            productName: `Product ${j + 1}`,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: Math.floor(Math.random() * 100) + 10,
            image: `/product${(j % 8) + 1}.jpg`,
          })),
          totalAmount: Math.floor(Math.random() * 500) + 50,
          status: ["pending", "processing", "shipped", "delivered", "cancelled"][Math.floor(Math.random() * 5)] as any,
          shippingAddress: "123 Main St, City, Country",
          paymentMethod: "Credit Card",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          updatedAt: new Date().toISOString(),
        }))

        state.orders.set(mockOrders)
        state.isLoading.set(false)

        return mockOrders
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return []
      }
    },

    fetchOrderById: async (orderId: string) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check if order exists in state
        const existingOrder = state.orders.value.find((order) => order.id === orderId)

        if (existingOrder) {
          state.currentOrder.set(existingOrder)
          state.isLoading.set(false)
          return existingOrder
        }

        // Mock order data
        const mockOrder: Order = {
          id: orderId,
          userId: "user-1",
          items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
            productId: `product-${j + 1}`,
            productName: `Product ${j + 1}`,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: Math.floor(Math.random() * 100) + 10,
            image: `/product${(j % 8) + 1}.jpg`,
          })),
          totalAmount: Math.floor(Math.random() * 500) + 50,
          status: "processing",
          shippingAddress: "123 Main St, City, Country",
          paymentMethod: "Credit Card",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          updatedAt: new Date().toISOString(),
        }

        state.currentOrder.set(mockOrder)
        state.isLoading.set(false)

        return mockOrder
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },

    createOrder: async (items: any[], shippingAddress: string, paymentMethod: string) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Calculate total amount
        const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0)

        // Create new order
        const newOrder: Order = {
          id: `order-${Date.now()}`,
          userId: "user-1",
          items,
          totalAmount,
          status: "pending",
          shippingAddress,
          paymentMethod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        state.orders.set([...state.orders.value, newOrder])
        state.currentOrder.set(newOrder)
        state.isLoading.set(false)

        return newOrder
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },

    updateOrderStatus: async (orderId: string, status: Order["status"]) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const orderIndex = state.orders.value.findIndex((order) => order.id === orderId)

        if (orderIndex >= 0) {
          const updatedOrders = [...state.orders.value]
          updatedOrders[orderIndex] = {
            ...updatedOrders[orderIndex],
            status,
            updatedAt: new Date().toISOString(),
          }

          state.orders.set(updatedOrders)

          if (state.currentOrder.value?.id === orderId) {
            state.currentOrder.set({
              ...state.currentOrder.value,
              status,
              updatedAt: new Date().toISOString(),
            })
          }

          state.isLoading.set(false)
          return updatedOrders[orderIndex]
        } else {
          throw new Error("Order not found")
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
  }
}

