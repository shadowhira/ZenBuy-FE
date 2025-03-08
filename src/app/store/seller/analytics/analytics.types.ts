export interface DailySales {
  date: string
  revenue: number
  orders: number
}

export interface ProductSales {
  productId: string
  productName: string
  quantity: number
  revenue: number
}

export interface AnalyticsState {
  dailySales: DailySales[]
  productSales: ProductSales[]
  timeFrame: "day" | "3days" | "week" | "month"
  isLoading: boolean
  error: string | null
}

