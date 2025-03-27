import { hookstate, useHookstate } from "@hookstate/core"
import type { OrdersState } from "./orders.types"
import { getOrders, getOrderById, createOrder, updateOrderStatus } from "../../../apis/orders"
import type { Order, ShippingAddress } from "../../../types"

// Initial state
const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
}

// Create the global state
const globalOrdersState = hookstate<OrdersState>(initialState)

// Helper function to convert immutable order to mutable
const convertOrder = (order: any): Order => ({
  ...order,
  items: order.items.map((item: any) => ({
    ...item,
    product: {
      ...item.product,
      category: {
        ...item.product.category,
        children: item.product.category.children ? [...item.product.category.children] : undefined
      },
      variants: item.product.variants ? [...item.product.variants] : undefined
    }
  }))
})

// Create hooks and actions
export const useOrdersState = () => {
  const state = useHookstate(globalOrdersState)

  return {
    // State với getters và setters
    get orders() {
      return state.orders.get().map(convertOrder)
    },
    set orders(value: Order[]) {
      state.orders.set(value)
    },

    get currentOrder() {
      const order = state.currentOrder.get()
      return order ? convertOrder(order) : null
    },
    set currentOrder(value: Order | null) {
      state.currentOrder.set(value)
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
    fetchOrders: async (params?: {
      page?: number;
      limit?: number;
      status?: Order['status'];
    }) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const { orders, total } = await getOrders(params)
        state.orders.set(orders)
        state.isLoading.set(false)

        return { orders, total }
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return { orders: [], total: 0 }
      }
    },

    fetchOrderById: async (orderId: number) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const order = await getOrderById(orderId)
        state.currentOrder.set(order)
        state.isLoading.set(false)

        return order
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },

    createOrder: async (orderData: {
      items: Array<{
        productId: number;
        variantId?: number;
        quantity: number;
      }>;
      shippingAddress: ShippingAddress;
      paymentMethod: string;
    }) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const order = await createOrder(orderData)
        state.orders.set([...state.orders.get(), order])
        state.isLoading.set(false)

        return order
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },

    updateOrderStatus: async (orderId: number, status: Order["status"]) => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const order = await updateOrderStatus(orderId, status)
        state.orders.set(state.orders.get().map(o => o.id === orderId ? order : o))
        
        if (state.currentOrder.get()?.id === orderId) {
          state.currentOrder.set(order)
        }

        state.isLoading.set(false)
        return order
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

