import { hookstate, useHookstate } from "@hookstate/core"
import type { AnalyticsState, DailySales, ProductSales } from "./analytics.types"

// Initial state
const initialState: AnalyticsState = {
  dailySales: [],
  productSales: [],
  timeFrame: "week",
  isLoading: false,
  error: null,
}

// Create the global state
const globalAnalyticsState = hookstate<AnalyticsState>(initialState)

// Create hooks and actions
export const useAnalyticsState = () => {
  const state = useHookstate(globalAnalyticsState)

  return {
    // State với getters và setters
    get dailySales() {
      return state.dailySales.value
    },
    set dailySales(value: DailySales[]) {
      state.dailySales.set(value)
    },

    get productSales() {
      return state.productSales.value
    },
    set productSales(value: ProductSales[]) {
      state.productSales.set(value)
    },

    get timeFrame() {
      return state.timeFrame.value
    },
    set timeFrame(value: "day" | "3days" | "week" | "month") {
      state.timeFrame.set(value)
    },

    get isLoading() {
      return state.isLoading.value
    },
    set isLoading(value: boolean) {
      state.isLoading.set(value)
    },

    get error() {
      return state.error.value
    },
    set error(value: string | null) {
      state.error.set(value)
    },

    // Computed values
    get totalRevenue() {
      return state.dailySales.value.reduce((total, day) => total + day.revenue, 0)
    },
    get totalOrders() {
      return state.dailySales.value.reduce((total, day) => total + day.orders, 0)
    },
    get averageOrderValue() {
      const totalOrders = this.totalOrders
      return totalOrders > 0 ? this.totalRevenue / totalOrders : 0
    },

    // Actions
    fetchAnalytics: async (timeFrame: "day" | "3days" | "week" | "month" = "week") => {
      try {
        state.isLoading.set(true)
        state.error.set(null)
        state.timeFrame.set(timeFrame)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate mock data based on timeFrame
        let days: number
        switch (timeFrame) {
          case "day":
            days = 1
            break
          case "3days":
            days = 3
            break
          case "week":
            days = 7
            break
          case "month":
            days = 30
            break
          default:
            days = 7
        }

        // Mock daily sales data
        const mockDailySales: DailySales[] = Array.from({ length: days }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (days - i - 1))
          return {
            date: date.toISOString().split("T")[0],
            revenue: Math.floor(Math.random() * 5000) + 1000,
            orders: Math.floor(Math.random() * 50) + 10,
          }
        })

        // Mock product sales data
        const mockProductSales: ProductSales[] = Array.from({ length: 10 }, (_, i) => ({
          productId: `product-${i + 1}`,
          productName: `Product ${i + 1}`,
          quantity: Math.floor(Math.random() * 100) + 10,
          revenue: Math.floor(Math.random() * 10000) + 1000,
        }))

        state.dailySales.set(mockDailySales)
        state.productSales.set(mockProductSales)
        state.isLoading.set(false)

        return {
          dailySales: mockDailySales,
          productSales: mockProductSales,
        }
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return {
          dailySales: [],
          productSales: [],
        }
      }
    },
  }
}

