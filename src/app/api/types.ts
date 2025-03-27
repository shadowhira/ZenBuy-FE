// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "customer" | "seller" | "admin";
    avatar?: string;
  };
  token: string;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export interface Cart {
  items: CartItem[];
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Order Types
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: Order["shippingAddress"];
  paymentMethod: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

// Analytics Types
export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductSales {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  notes?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
} 