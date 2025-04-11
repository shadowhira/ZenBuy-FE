"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Button } from "@components/ui/button"
import { useAnalyticsState } from "@store/seller/analytics/analytics.state"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Revenue Chart",
    },
  },
}

interface RevenueChartProps {
  timeFrame: "day" | "3days" | "week" | "month"
  onTimeFrameChange: (timeFrame: "day" | "3days" | "week" | "month") => void
}

export default function RevenueChart({ timeFrame, onTimeFrameChange }: RevenueChartProps) {
  const analyticsState = useAnalyticsState()

  // Ensure dailySales exists before mapping
  const dailySales = analyticsState.dailySales || []

  // Prepare chart data from analytics state
  const chartData = {
    labels: dailySales.map(day => day.date),
    datasets: [
      {
        label: "Revenue",
        data: dailySales.map(day => day.revenue),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Orders",
        data: dailySales.map(day => day.orders * 100), // Scale orders to be visible on same chart
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: 'y1',
      },
    ],
  }

  // Extended options to support dual y-axis
  const extendedOptions = {
    ...options,
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue ($)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Orders (x100)',
        },
      },
    },
  }

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={() => onTimeFrameChange("day")}
          variant={timeFrame === "day" ? "default" : "outline"}
        >
          1 Day
        </Button>
        <Button
          onClick={() => onTimeFrameChange("3days")}
          variant={timeFrame === "3days" ? "default" : "outline"}
        >
          3 Days
        </Button>
        <Button
          onClick={() => onTimeFrameChange("week")}
          variant={timeFrame === "week" ? "default" : "outline"}
        >
          7 Days
        </Button>
        <Button
          onClick={() => onTimeFrameChange("month")}
          variant={timeFrame === "month" ? "default" : "outline"}
        >
          30 Days
        </Button>
      </div>
      <Line options={extendedOptions} data={chartData} />
    </div>
  )
}
