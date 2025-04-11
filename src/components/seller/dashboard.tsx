"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import RevenueChart from "@components/seller/revenue-chart"
import { useAnalytics } from "@hooks/use-analytics"
import { useAnalyticsState } from "@store/seller/analytics/analytics.state"
import { Skeleton } from "@components/ui/skeleton"
import { Button } from "@components/ui/button"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function Dashboard() {
  const { t } = useTranslation("seller-dashboard")
  const [timeFrame, setTimeFrame] = useState<"day" | "3days" | "week" | "month">("week")
  const { data, isLoading, error } = useAnalytics(timeFrame)
  const analyticsState = useAnalyticsState()

  // Handle API errors
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    if (error) {
      console.error('Analytics API error:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to load analytics data')
    } else {
      setApiError(null)
    }
  }, [error])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  // Function to seed analytics data
  const seedAnalyticsData = async () => {
    try {
      const response = await fetch('/api/seed/analytics')
      const data = await response.json()
      if (response.ok) {
        alert(`Analytics data seeded successfully! Created ${data.ordersCount} orders.`)
        window.location.reload()
      } else {
        alert(`Error: ${data.error || 'Failed to seed data'}`)
      }
    } catch (error) {
      console.error('Error seeding analytics data:', error)
      alert('Failed to seed analytics data. See console for details.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-80 w-full bg-gray-100 animate-pulse rounded-lg" />
      </div>
    )
  }

  // Show API error if any
  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-red-500">
          <Package className="h-16 w-16 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Error Loading Analytics</h2>
        </div>
        <p className="mb-6 text-gray-600 max-w-md">
          {apiError}
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  // Check if we have any data
  const hasData = !isLoading && data && data.dailySales && data.dailySales.length > 0

  if (!isLoading && !hasData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-amber-500">
          <Package className="h-16 w-16 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">{t("noAnalyticsDataAvailable")}</h2>
        </div>
        <p className="mb-6 text-gray-600 max-w-md">
          {t("noAnalyticsDataMessage")}
        </p>
        <Button onClick={seedAnalyticsData}>{t("seedAnalyticsData")}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalRevenue")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.totalRevenue || 0)}</div>
            <p className={`text-xs ${(data?.revenueChange || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(data?.revenueChange || 0)} {t("fromLastPeriod")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("orders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data?.totalOrders || 0}</div>
            <p className={`text-xs ${(data?.ordersChange || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(data?.ordersChange || 0)} {t("fromLastPeriod")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("products")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data?.productsCount || 0}</div>
            <p className="text-xs text-muted-foreground">{t("totalProductsInInventory")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("activeCustomers")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data?.activeCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">{t("uniqueCustomersThisPeriod")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("conversionRate")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data?.conversionRate || 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{t("ordersProductViews")}</p>
          </CardContent>
        </Card>
      </div>
      <RevenueChart timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />
    </div>
  )
}
