"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { useAnalyticsState } from "@store/seller/analytics/analytics.state"
import { Skeleton } from "@components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table"
import { Badge } from "@components/ui/badge"
import { useTranslation } from "react-i18next"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface TopProductsProps {
  isLoading: boolean
}

export default function TopProducts({ isLoading }: TopProductsProps) {
  const { t } = useTranslation("seller-analytics")
  const analyticsState = useAnalyticsState()

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  // Top products chart data
  const topProductsData = {
    labels: analyticsState.productSales.map(product => product.productName),
    datasets: [
      {
        label: 'Revenue',
        data: analyticsState.productSales.map(product => product.revenue),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
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
        <CardTitle>{t("topSellingProducts")}</CardTitle>
        <CardDescription>{t("yourBestPerformingProducts")}</CardDescription>
      </CardHeader>
      <CardContent>
        {analyticsState.productSales.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t("noProductSalesData")}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-64">
              <Bar
                data={topProductsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y' as const,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    title: {
                      display: true,
                      text: t("revenueByProduct"),
                    },
                  },
                }}
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("rank")}</TableHead>
                  <TableHead>{t("product")}</TableHead>
                  <TableHead className="text-right">{t("quantity")}</TableHead>
                  <TableHead className="text-right">{t("revenue")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsState.productSales.map((product, index) => (
                  <TableRow key={product.productId}>
                    <TableCell>
                      {index === 0 ? (
                        <Badge className="bg-yellow-500">1</Badge>
                      ) : index === 1 ? (
                        <Badge className="bg-gray-400">2</Badge>
                      ) : index === 2 ? (
                        <Badge className="bg-amber-600">3</Badge>
                      ) : (
                        <Badge variant="outline">{index + 1}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
