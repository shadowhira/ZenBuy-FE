import type { DailySales, ProductSales } from "src/types";

export interface AnalyticsState {
  dailySales: DailySales[];
  productSales: ProductSales[];
  timeFrame: "day" | "3days" | "week" | "month";
  isLoading: boolean;
  error: string | null;
}

