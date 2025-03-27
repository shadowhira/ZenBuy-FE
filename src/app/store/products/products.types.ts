import type { Product } from "src/types";

export interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

