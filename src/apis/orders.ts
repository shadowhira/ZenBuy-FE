import { Order, ShippingAddress } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.escuelajs.co/api/v1';

export async function createOrder(order: {
  items: { productId: number; variantId?: number; quantity: number }[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
}

export async function getOrderById(id: number): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`);
  if (!response.ok) throw new Error('Failed to fetch order');
  return response.json();
}

export async function updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update order status');
  return response.json();
}

export async function getOrders(params?: {
  page?: number;
  limit?: number;
  status?: Order['status'];
}): Promise<{ orders: Order[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);

  const response = await fetch(`${API_BASE_URL}/orders?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
} 