export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  variant?: string
  image: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface OrdersState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  error: string | null
}

