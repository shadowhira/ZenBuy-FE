export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
}

export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash';

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface Order {
  id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
