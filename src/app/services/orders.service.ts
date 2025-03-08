import { fetchApi } from "./api"
import type { Order } from "@/store/orders/orders.types"

interface OrdersResponse {
  orders: Order[]
  total: number
  page: number
  limit: number
}

interface CreateOrderRequest {
  items: {
    productId: string
    quantity: number
    variant?: string
  }[]
  shippingAddress: string
  paymentMethod: string
}

export const ordersService = {
  getOrders: (page = 1, limit = 10) => fetchApi<OrdersResponse>(`/orders?page=${page}&limit=${limit}`),

  getOrderById: (id: string) => fetchApi<Order>(`/orders/${id}`),

  createOrder: (data: CreateOrderRequest) =>
    fetchApi<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateOrderStatus: (id: string, status: Order["status"]) =>
    fetchApi<Order>(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
}

