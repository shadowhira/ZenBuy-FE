import type { Shop } from "src/types";

export interface ShopDetails extends Omit<Shop, 'products'> {
  bannerImage: string;
  avatarImage: string;
  featuredProducts: string[];
}

export interface ShopState {
  details: Shop | null;
  isLoading: boolean;
  error: string | null;
}

export interface SellerState {
  shop: Shop | null;
  isLoading: boolean;
  error: string | null;
} 