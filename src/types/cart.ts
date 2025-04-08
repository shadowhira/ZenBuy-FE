export interface CartItem {
  id: string;
  productId?: string;
  product?: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  stock?: number;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variant?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}
