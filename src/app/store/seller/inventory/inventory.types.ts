import type { InventoryItem } from "src/types";

export interface InventoryState {
  items: InventoryItem[];
  isLoading: boolean;
  error: string | null;
}

