import { hookstate, useHookstate } from "@hookstate/core"
import type { AnalyticsState } from "./analytics.types"
import { getAnalytics } from "../../../../apis/analytics"
import type { DailySales, ProductSales } from "../../../../types"

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

// Helper function to convert immutable arrays to mutable
const convertArray = <T>(arr: readonly T[]): T[] => [...arr]

// Create hooks and actions
export const useAnalyticsState = () => {
  const state = useHookstate(globalAnalyticsState)

  return {
    // State với getters và setters
    get dailySales() {
      return convertArray(state.dailySales.get())
    },
    set dailySales(value: DailySales[]) {
      state.dailySales.set(value)
    },

    get productSales() {
      return convertArray(state.productSales.get())
    },
    set productSales(value: ProductSales[]) {
      state.productSales.set(value)
    },

    get timeFrame() {
      return state.timeFrame.get()
    },
    set timeFrame(value: "day" | "3days" | "week" | "month") {
      state.timeFrame.set(value)
    },

    get isLoading() {
      return state.isLoading.get()
    },
    set isLoading(value: boolean) {
      state.isLoading.set(value)
    },

    get error() {
      return state.error.get()
    },
    set error(value: string | null) {
      state.error.set(value)
    },

    // Computed values
    get totalRevenue() {
      return state.dailySales.get().reduce((total, day) => total + day.revenue, 0)
    },
    get totalOrders() {
      return state.dailySales.get().reduce((total, day) => total + day.orders, 0)
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

        const { dailySales, productSales } = await getAnalytics(timeFrame)
        state.dailySales.set(dailySales)
        state.productSales.set(productSales)
        state.isLoading.set(false)

        return {
          dailySales,
          productSales,
        }
      } catch (error) {
        state.set({
          ...state.get(),
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

