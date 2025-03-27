import type { CartItem } from "src/types";

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

