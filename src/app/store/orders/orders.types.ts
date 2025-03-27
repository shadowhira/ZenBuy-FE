import type { Order } from "src/types";

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  variant?: string
  image: string
}

export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

