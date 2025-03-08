import { useSuspenseQuery } from "@tanstack/react-query"
import { analyticsService } from "@/services/analytics.service"
import { useAnalyticsState } from "@/store"

export function useAnalytics(timeFrame: "day" | "3days" | "week" | "month" = "week") {
  const analyticsState = useAnalyticsState()

  const query = useSuspenseQuery({
    queryKey: ["analytics", timeFrame],
    queryFn: () => analyticsService.getAnalytics(timeFrame),
    select: (data) => {
      // Cập nhật state trong Hookstate
      analyticsState.dailySales = data.dailySales
      analyticsState.productSales = data.productSales
      analyticsState.timeFrame = timeFrame
      return data
    },
  })

  return query
}

