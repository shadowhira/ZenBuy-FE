"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { BarChart2 } from "lucide-react"
import { Button } from "@components/ui/button"
import { useAnalytics } from "@hooks/use-analytics"
import { useAnalyticsState } from "@store/seller/analytics/analytics.state"
import { Skeleton } from "@components/ui/skeleton"
import TopProducts from "@components/seller/top-products"
import AdvancedAnalytics from "@components/seller/advanced-analytics"
import { useTranslation } from "react-i18next"

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Sales Analysis",
    },
  },
}

export default function SalesAnalysis() {
  const { t } = useTranslation("seller-analytics")

  // Map our timeFrame to the API's timeFrame
  const timeFrameMap = {
    "1day": "day" as const,
    "3days": "3days" as const,
    "week": "week" as const,
    "month": "month" as const,
  }

  const [timeFrame, setTimeFrame] = useState<"1day" | "3days" | "week" | "month">("week")
  const [apiError, setApiError] = useState<string | null>(null)
  const { data, isLoading, error } = useAnalytics(timeFrameMap[timeFrame])
  const analyticsState = useAnalyticsState()

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error('Analytics API error:', error)
      setApiError(error instanceof Error ? error.message : 'Failed to load analytics data')
    } else {
      setApiError(null)
    }
  }, [error])

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

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const getLabels = () => {
    return (data?.dailySales || []).map(day => day.date)
  }

  const chartData = {
    labels: getLabels(),
    datasets: [
      {
        label: "Revenue",
        data: (data?.dailySales || []).map(day => day.revenue),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgb(53, 162, 235)",
      },
    ],
  }

  // Top selling products chart data
  const productChartData = {
    labels: (data?.productSales || []).map(product => product.productName),
    datasets: [
      {
        label: "Revenue",
        data: (data?.productSales || []).map(product => product.revenue),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 206, 86)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
    ],
  }


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-100 p-4 rounded-lg">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-9 w-20" />
              ))}
            </div>
            <div className="h-80 w-full bg-gray-100 animate-pulse rounded-lg" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if we have any data
  const hasData = !isLoading && data && data.dailySales && data.dailySales.length > 0

  // Show API error if any
  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-red-500">
          <BarChart2 className="h-16 w-16 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">{t("errorLoadingAnalytics")}</h2>
        </div>
        <p className="mb-6 text-gray-600 max-w-md">
          {apiError}
        </p>
        <Button onClick={() => window.location.reload()}>{t("retry")}</Button>
      </div>
    )
  }


  if (!isLoading && !hasData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-amber-500">
          <BarChart2 className="h-16 w-16 mx-auto mb-2" />
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
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("salesOverview")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium mb-1">{t("totalSales")}</h3>
                <p className="text-xl font-bold">{formatCurrency(data?.totalRevenue || 0)}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium mb-1">{t("orders")}</h3>
                <p className="text-xl font-bold">{data?.totalOrders || 0}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium mb-1">{t("averageOrderValue")}</h3>
                <p className="text-xl font-bold">{formatCurrency(data?.averageOrderValue || 0)}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium mb-1">{t("conversionRate")}</h3>
                <p className="text-xl font-bold">{(data?.conversionRate || 0).toFixed(1)}%</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium mb-1">{t("avgItemsPerOrder")}</h3>
                <p className="text-xl font-bold">{(data?.averageItemsPerOrder || 0).toFixed(1)}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <h3 className="text-sm font-medium mb-1">{t("couponUsage")}</h3>
                <p className="text-xl font-bold">{(data?.couponUsage?.rate || 0).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products Component */}
        <TopProducts isLoading={isLoading} />
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("salesAnalysis")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={() => setTimeFrame("1day")} variant={timeFrame === "1day" ? "default" : "outline"}>
              {t("day")}
            </Button>
            <Button onClick={() => setTimeFrame("3days")} variant={timeFrame === "3days" ? "default" : "outline"}>
              {t("threeDays")}
            </Button>
            <Button onClick={() => setTimeFrame("week")} variant={timeFrame === "week" ? "default" : "outline"}>
              {t("week")}
            </Button>
            <Button onClick={() => setTimeFrame("month")} variant={timeFrame === "month" ? "default" : "outline"}>
              {t("month")}
            </Button>
          </div>
          {timeFrame === "1day" || timeFrame === "3days" ? (
            <Line options={options} data={chartData} />
          ) : (
            <Bar options={options} data={chartData} />
          )}
        </CardContent>
      </Card>

      {/* Advanced Analytics Component */}
      <AdvancedAnalytics isLoading={isLoading} />
    </div>
  )
}
