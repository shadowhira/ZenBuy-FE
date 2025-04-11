import { fetchApi } from "./api"
import type { DailySales, ProductSales } from "@/types"

interface PaymentMethodDistribution {
  credit_card: number
  bank_transfer: number
  cash: number
}

interface OrderStatusDistribution {
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
}

interface CouponUsage {
  rate: number
  averageDiscount: number
  totalDiscount: number
  ordersWithCoupons: number
}

interface AnalyticsResponse {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  productsCount: number
  activeCustomers: number
  averageOrderValue: number
  conversionRate: number
  dailySales: DailySales[]
  productSales: ProductSales[]
  averageItemsPerOrder: number
  paymentMethods: PaymentMethodDistribution
  orderStatuses: OrderStatusDistribution
  couponUsage: CouponUsage
}

export const analyticsService = {
  getAnalytics: (timeFrame: "day" | "3days" | "week" | "month" = "week") =>
    fetchApi<AnalyticsResponse>(`/seller/analytics?timeFrame=${timeFrame}`),
}
