"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { useAnalyticsState } from "@store/seller/analytics/analytics.state"
import { Skeleton } from "@components/ui/skeleton"
import { useTranslation } from "react-i18next"

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface AdvancedAnalyticsProps {
  isLoading: boolean
}

export default function AdvancedAnalytics({ isLoading }: AdvancedAnalyticsProps) {
  const { t } = useTranslation("seller-analytics")
  const [activeTab, setActiveTab] = useState("payment")
  const analyticsState = useAnalyticsState()

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Payment methods chart data
  const paymentMethodsData = {
    labels: ['Credit Card', 'Bank Transfer', 'Cash'],
    datasets: [
      {
        data: [
          analyticsState.paymentMethods.credit_card,
          analyticsState.paymentMethods.bank_transfer,
          analyticsState.paymentMethods.cash,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Order statuses chart data
  const orderStatusesData = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [
          analyticsState.orderStatuses.pending,
          analyticsState.orderStatuses.processing,
          analyticsState.orderStatuses.shipped,
          analyticsState.orderStatuses.delivered,
          analyticsState.orderStatuses.cancelled,
        ],
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(46, 204, 113, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Coupon usage data
  const couponData = {
    labels: ['Orders with Coupons', 'Orders without Coupons'],
    datasets: [
      {
        data: [
          analyticsState.couponUsage.ordersWithCoupons,
          analyticsState.totalOrders - analyticsState.couponUsage.ordersWithCoupons,
        ],
        backgroundColor: [
          'rgba(153, 102, 255, 0.6)',
          'rgba(201, 203, 207, 0.6)',
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full bg-gray-100 animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("advancedAnalytics")}</CardTitle>
        <CardDescription>{t("detailedInsights")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="payment" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payment">{t("paymentMethods")}</TabsTrigger>
            <TabsTrigger value="status">{t("orderStatuses")}</TabsTrigger>
            <TabsTrigger value="coupon">{t("couponUsageStats")}</TabsTrigger>
          </TabsList>

          <TabsContent value="payment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="h-64">
                <Pie data={paymentMethodsData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("paymentMethodDistribution")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("creditCard")}</div>
                    <div className="text-xl font-bold">{analyticsState.paymentMethods.credit_card}</div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(
                        (analyticsState.paymentMethods.credit_card / analyticsState.totalOrders) * 100
                      )}
                    </div>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("bankTransfer")}</div>
                    <div className="text-xl font-bold">{analyticsState.paymentMethods.bank_transfer}</div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(
                        (analyticsState.paymentMethods.bank_transfer / analyticsState.totalOrders) * 100
                      )}
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("cash")}</div>
                    <div className="text-xl font-bold">{analyticsState.paymentMethods.cash}</div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(
                        (analyticsState.paymentMethods.cash / analyticsState.totalOrders) * 100
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("totalOrders")}</div>
                    <div className="text-xl font-bold">{analyticsState.totalOrders}</div>
                    <div className="text-sm text-gray-500">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="h-64">
                <Pie data={orderStatusesData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("orderStatusDistribution")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-orange-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("pending")}</div>
                    <div className="text-xl font-bold">{analyticsState.orderStatuses.pending}</div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(
                        (analyticsState.orderStatuses.pending / analyticsState.totalOrders) * 100
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("processing")}</div>
                    <div className="text-xl font-bold">{analyticsState.orderStatuses.processing}</div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(
                        (analyticsState.orderStatuses.processing / analyticsState.totalOrders) * 100
                      )}
                    </div>
                  </div>
                  <div className="bg-teal-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("shipped")}</div>
                    <div className="text-xl font-bold">{analyticsState.orderStatuses.shipped}</div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(
                        (analyticsState.orderStatuses.shipped / analyticsState.totalOrders) * 100
                      )}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("delivered")}</div>
                    <div className="text-xl font-bold">{analyticsState.orderStatuses.delivered}</div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(
                        (analyticsState.orderStatuses.delivered / analyticsState.totalOrders) * 100
                      )}
                    </div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("cancelled")}</div>
                    <div className="text-xl font-bold">{analyticsState.orderStatuses.cancelled}</div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(
                        (analyticsState.orderStatuses.cancelled / analyticsState.totalOrders) * 100
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("totalOrders")}</div>
                    <div className="text-xl font-bold">{analyticsState.totalOrders}</div>
                    <div className="text-sm text-gray-500">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="coupon" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="h-64">
                <Pie data={couponData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("couponUsageStatistics")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-purple-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("ordersWithCoupons")}</div>
                    <div className="text-xl font-bold">{analyticsState.couponUsage.ordersWithCoupons}</div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(analyticsState.couponUsage.rate)}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("ordersWithoutCoupons")}</div>
                    <div className="text-xl font-bold">
                      {analyticsState.totalOrders - analyticsState.couponUsage.ordersWithCoupons}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPercentage(100 - analyticsState.couponUsage.rate)}
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("averageDiscount")}</div>
                    <div className="text-xl font-bold">
                      {formatCurrency(analyticsState.couponUsage.averageDiscount)}
                    </div>
                    <div className="text-sm text-gray-500">{t("perOrderWithCoupon")}</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">{t("totalDiscount")}</div>
                    <div className="text-xl font-bold">
                      {formatCurrency(analyticsState.couponUsage.totalDiscount)}
                    </div>
                    <div className="text-sm text-gray-500">{t("allOrders")}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
