export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  variants?: ProductVariant[];
  stock: number;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
  shop: Shop;
}

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  parentId?: number;
  children?: Category[];
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export interface Shop {
  id: number;
  name: string;
  description: string;
  logo: string;
  products: Product[];
  rating: number;
  followers: number;
  createdAt: string;
  updatedAt: string;
  reviews: number;
}

export interface Cart {
  items: CartItem[];
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export type PaymentMethod = "credit_card" | "bank_transfer" | "cash";

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "customer" | "seller" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

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

export interface CreateInventoryItemRequest {
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  notes?: string;
  images: string[];
}

export interface UpdateInventoryItemRequest {
  productName?: string;
  sku?: string;
  quantity?: number;
  unitPrice?: number;
  supplier?: string;
  notes?: string;
  images?: string[];
}

export interface InventoryResponse {
  items: InventoryItem[];
  total: number;
  page: number;
  limit: number;
}

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

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// Auth Types
export type UserRole = "customer" | "seller" | "admin";

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
  user: User;
  token: string;
} 