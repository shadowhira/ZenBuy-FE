import { fetchApi } from "./api"
import type { Order, OrdersResponse, ShippingAddress, PaymentMethod } from "@/types"

interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export const ordersService = {
  getOrders: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    return fetchApi<OrdersResponse>(`/orders?${queryParams.toString()}`);
  },

  getOrderById: (id: string) => fetchApi<Order>(`/orders/${id}`),

  createOrder: (data: CreateOrderRequest) =>
    fetchApi<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateOrderStatus: (id: string, status: Order['status']) =>
    fetchApi<Order>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  cancelOrder: (id: string) =>
    fetchApi<Order>(`/orders/${id}/cancel`, {
      method: "POST",
    }),
}

