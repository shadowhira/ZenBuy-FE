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
  id: number;
  productId: number;
  variantId?: number;
  quantity: number;
  price: number;
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
  productId: number;
  variantId?: number;
  quantity: number;
  name: string;
  price: number;
  image?: string;
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
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "customer" | "seller" | "admin";
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