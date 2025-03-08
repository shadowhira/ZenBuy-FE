import type { Order } from "@/store/orders/orders.types"

// Mô phỏng lưu trữ đơn hàng
const orderStorage = new Map<string, Order[]>()

export async function getOrders(userId: string): Promise<Order[]> {
  // Lấy danh sách đơn hàng từ storage
  const orders = orderStorage.get(userId)

  // Nếu không có đơn hàng, trả về mảng rỗng
  if (!orders) {
    return []
  }

  return orders
}

export async function saveOrder(userId: string, orders: Order[]): Promise<void> {
  // Lưu danh sách đơn hàng vào storage
  orderStorage.set(userId, orders)
}

