import type { Order } from "src/types";

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  variantId?: number;
  image: string;
}

export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

