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
    // State
    get dailySales() {
      return state.dailySales.value
    },
    get productSales() {
      return state.productSales.value
    },
    get timeFrame() {
      return state.timeFrame.value
    },
    get isLoading() {
      return state.isLoading.value
    },
    get error() {
      return state.error.value
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
    setTimeFrame: (timeFrame: "day" | "3days" | "week" | "month") => {
      state.timeFrame.set(timeFrame)
      // Fetch new data based on timeframe
      return this.fetchAnalytics(timeFrame)
    },

    fetchAnalytics: async (timeFrame?: "day" | "3days" | "week" | "month") => {
      try {
        state.isLoading.set(true)
        state.error.set(null)

        const tf = timeFrame || state.timeFrame.value

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate mock data based on timeframe
        let days = 0
        switch (tf) {
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
        }

        // Mock daily sales data
        const mockDailySales: DailySales[] = Array.from({ length: days }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (days - i - 1))

          return {
            date: date.toISOString().split("T")[0],
            revenue: Math.floor(Math.random() * 1000) + 500,
            orders: Math.floor(Math.random() * 20) + 5,
          }
        })

        // Mock product sales data
        const mockProductSales: ProductSales[] = Array.from({ length: 10 }, (_, i) => ({
          productId: `product-${i + 1}`,
          productName: `Product ${i + 1}`,
          quantity: Math.floor(Math.random() * 50) + 1,
          revenue: Math.floor(Math.random() * 2000) + 100,
        }))

        state.set({
          ...state.value,
          dailySales: mockDailySales,
          productSales: mockProductSales,
          timeFrame: tf,
          isLoading: false,
        })

        return { dailySales: mockDailySales, productSales: mockProductSales }
      } catch (error) {
        state.set({
          ...state.value,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return null
      }
    },
  }
}

