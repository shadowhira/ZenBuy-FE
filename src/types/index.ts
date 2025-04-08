export interface Product {
  id?: number;
  _id?: string;  // Thêm cho tương thích với MongoDB
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
  slug?: string;  // Thêm cho tương thích với MongoDB
}

export interface ProductVariant {
  id?: number;
  _id?: string;  // Thêm cho tương thích với MongoDB
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Category {
  id?: number;
  _id?: string;  // Thêm cho tương thích với MongoDB
  name: string;
  image: string;
  parentId?: number;
  parent?: string;  // Thêm cho tương thích với MongoDB
  children?: Category[];
  slug?: string;  // Thêm cho tương thích với MongoDB
}

export interface Order {
  id?: number;
  _id?: string;  // Thêm cho tương thích với MongoDB
  userId?: number;
  user?: string;  // Thêm cho tương thích với MongoDB
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total?: number;
  totalAmount?: number; // Thêm cho tương thích với API
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  _id?: string;  // Thêm cho tương thích với MongoDB
  product?: string;  // Thêm cho tương thích với MongoDB (reference)
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
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
  id?: string;
  _id?: string;  // Thêm cho tương thích với MongoDB
  product?: string;  // Thêm cho tương thích với MongoDB (reference)
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export interface Shop {
  id?: number;
  _id?: string;  // Thêm cho tương thích với MongoDB
  name: string;
  description: string;
  logo: string;
  banner?: string;  // Thêm cho tương thích với MongoDB
  products?: Product[];
  rating?: number;
  followers?: number;
  createdAt?: string;
  updatedAt?: string;
  reviews?: number;
  slug?: string;  // Thêm cho tương thích với MongoDB
  owner?: string;  // Thêm cho tương thích với MongoDB (reference to User)
}

export interface Cart {
  _id?: string;  // Thêm cho tương thích với MongoDB
  user?: string;  // Thêm cho tương thích với MongoDB (reference to User)
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
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
  id?: string;
  _id?: string;  // Thêm cho tương thích với MongoDB
  name: string;
  email: string;
  avatar?: string;
  role: "customer" | "seller" | "admin";
  createdAt?: string;
  updatedAt?: string;
  password?: string;  // Chỉ dùng cho API, không bao giờ gửi về client
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
  totalPages?: number; // Thêm cho tương thích với API
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

// Re-export from cart.ts
export type { AddToCartRequest, UpdateCartItemRequest, CartState } from './cart';

// Re-export from order.ts
export type {
  ShippingAddress,
  PaymentMethod,
  OrderItem,
  Order,
  OrdersResponse
} from './order';

// Re-export from product.ts
export type {
  ProductQueryParams,
  ProductsResponse,
  Product
} from './product';