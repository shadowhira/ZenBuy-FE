import { useQuery } from "@tanstack/react-query"
import { analyticsService } from "@services/analytics.service"
import { useAnalyticsState } from "@store/seller/analytics/analytics.state"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useAnalytics(timeFrame: "day" | "3days" | "week" | "month" = "week") {
  const analyticsState = useAnalyticsState()
  const router = useRouter()

  const query = useQuery({
    queryKey: ["analytics", timeFrame],
    queryFn: async () => {
      try {
        return await analyticsService.getAnalytics(timeFrame)
      } catch (error) {
        // Check if error is unauthorized
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          toast.error('Session expired. Please log in again.')
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push('/login')
          }, 1500)
        }
        throw error
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once for failed requests
  })

  // Update state after data is fetched successfully
  useEffect(() => {
    if (query.data) {
      analyticsState.dailySales = query.data.dailySales || []
      analyticsState.productSales = query.data.productSales || []
      analyticsState.totalRevenue = query.data.totalRevenue || 0
      analyticsState.revenueChange = query.data.revenueChange || 0
      analyticsState.totalOrders = query.data.totalOrders || 0
      analyticsState.ordersChange = query.data.ordersChange || 0
      analyticsState.productsCount = query.data.productsCount || 0
      analyticsState.activeCustomers = query.data.activeCustomers || 0
      analyticsState.averageOrderValue = query.data.averageOrderValue || 0
      analyticsState.conversionRate = query.data.conversionRate || 0

      // Update new metrics
      if (query.data.averageItemsPerOrder !== undefined) {
        analyticsState.averageItemsPerOrder = query.data.averageItemsPerOrder
      }

      if (query.data.paymentMethods !== undefined) {
        analyticsState.paymentMethods = query.data.paymentMethods
      }

      if (query.data.orderStatuses !== undefined) {
        analyticsState.orderStatuses = query.data.orderStatuses
      }

      if (query.data.couponUsage !== undefined) {
        analyticsState.couponUsage = query.data.couponUsage
      }

      analyticsState.timeFrame = timeFrame
    }
  }, [query.data, timeFrame, analyticsState])

  return query
}

