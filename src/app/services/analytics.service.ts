import { fetchApi } from "./api"
import type { DailySales, ProductSales } from "@/store/seller/analytics/analytics.types"

interface AnalyticsResponse {
  dailySales: DailySales[]
  productSales: ProductSales[]
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
}

export const analyticsService = {
  getAnalytics: (timeFrame: "day" | "3days" | "week" | "month" = "week") =>
    fetchApi<AnalyticsResponse>(`/seller/analytics?timeFrame=${timeFrame}`),
}

