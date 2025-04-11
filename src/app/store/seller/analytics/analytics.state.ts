import { hookstate, useHookstate } from "@hookstate/core"
import type { AnalyticsState } from "./analytics.types"
import { getAnalytics } from "../../../../apis/analytics"
import type { DailySales, ProductSales } from "../../../../types"

// Initial state
const initialState: AnalyticsState = {
  dailySales: [],
  productSales: [],
  totalRevenue: 0,
  revenueChange: 0,
  totalOrders: 0,
  ordersChange: 0,
  productsCount: 0,
  activeCustomers: 0,
  averageOrderValue: 0,
  conversionRate: 0,
  averageItemsPerOrder: 0,
  paymentMethods: {
    credit_card: 0,
    bank_transfer: 0,
    cash: 0
  },
  orderStatuses: {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  },
  couponUsage: {
    rate: 0,
    averageDiscount: 0,
    totalDiscount: 0,
    ordersWithCoupons: 0
  },
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

    get totalRevenue() {
      return state.totalRevenue.get()
    },
    set totalRevenue(value: number) {
      state.totalRevenue.set(value)
    },

    get revenueChange() {
      return state.revenueChange.get()
    },
    set revenueChange(value: number) {
      state.revenueChange.set(value)
    },

    get totalOrders() {
      return state.totalOrders.get()
    },
    set totalOrders(value: number) {
      state.totalOrders.set(value)
    },

    get ordersChange() {
      return state.ordersChange.get()
    },
    set ordersChange(value: number) {
      state.ordersChange.set(value)
    },

    get productsCount() {
      return state.productsCount.get()
    },
    set productsCount(value: number) {
      state.productsCount.set(value)
    },

    get activeCustomers() {
      return state.activeCustomers.get()
    },
    set activeCustomers(value: number) {
      state.activeCustomers.set(value)
    },

    get averageOrderValue() {
      return state.averageOrderValue.get()
    },
    set averageOrderValue(value: number) {
      state.averageOrderValue.set(value)
    },

    get conversionRate() {
      return state.conversionRate.get()
    },
    set conversionRate(value: number) {
      state.conversionRate.set(value)
    },

    get averageItemsPerOrder() {
      return state.averageItemsPerOrder.get()
    },
    set averageItemsPerOrder(value: number) {
      state.averageItemsPerOrder.set(value)
    },

    get paymentMethods() {
      return state.paymentMethods.get()
    },
    set paymentMethods(value: { credit_card: number, bank_transfer: number, cash: number }) {
      state.paymentMethods.set(value)
    },

    get orderStatuses() {
      return state.orderStatuses.get()
    },
    set orderStatuses(value: { pending: number, processing: number, shipped: number, delivered: number, cancelled: number }) {
      state.orderStatuses.set(value)
    },

    get couponUsage() {
      return state.couponUsage.get()
    },
    set couponUsage(value: { rate: number, averageDiscount: number, totalDiscount: number, ordersWithCoupons: number }) {
      state.couponUsage.set(value)
    },

    // Actions
    fetchAnalytics: async (timeFrame: "day" | "3days" | "week" | "month" = "week") => {
      try {
        state.isLoading.set(true)
        state.error.set(null)
        state.timeFrame.set(timeFrame)

        const data = await getAnalytics(timeFrame)
        state.dailySales.set(data.dailySales)
        state.productSales.set(data.productSales)
        state.totalRevenue.set(data.totalRevenue)
        state.revenueChange.set(data.revenueChange)
        state.totalOrders.set(data.totalOrders)
        state.ordersChange.set(data.ordersChange)
        state.productsCount.set(data.productsCount)
        state.activeCustomers.set(data.activeCustomers)
        state.averageOrderValue.set(data.averageOrderValue)
        state.conversionRate.set(data.conversionRate)

        // Set new metrics
        if (data.averageItemsPerOrder !== undefined) {
          state.averageItemsPerOrder.set(data.averageItemsPerOrder)
        }

        if (data.paymentMethods !== undefined) {
          state.paymentMethods.set(data.paymentMethods)
        }

        if (data.orderStatuses !== undefined) {
          state.orderStatuses.set(data.orderStatuses)
        }

        if (data.couponUsage !== undefined) {
          state.couponUsage.set(data.couponUsage)
        }

        state.isLoading.set(false)

        return data
      } catch (error) {
        state.set({
          ...state.get(),
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        })
        return {
          dailySales: [],
          productSales: [],
          totalRevenue: 0,
          revenueChange: 0,
          totalOrders: 0,
          ordersChange: 0,
          productsCount: 0,
          activeCustomers: 0,
          averageOrderValue: 0,
          conversionRate: 0,
          averageItemsPerOrder: 0,
          paymentMethods: {
            credit_card: 0,
            bank_transfer: 0,
            cash: 0
          },
          orderStatuses: {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
          },
          couponUsage: {
            rate: 0,
            averageDiscount: 0,
            totalDiscount: 0,
            ordersWithCoupons: 0
          }
        }
      }
    },
  }
}

