import type { Shop } from "src/types";

export interface SellerState {
  shop: Shop | null;
  isLoading: boolean;
  error: string | null;
} 