"use client"

import { useState } from "react"
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
import { Button } from "@components/ui/button"


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

const generateRandomData = (count: number) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 1000))
}

export default function SalesAnalysis() {
  const [timeFrame, setTimeFrame] = useState<"1day" | "3days" | "week" | "month">("week")

  const getLabels = () => {
    switch (timeFrame) {
      case "1day":
        return Array.from({ length: 24 }, (_, i) => `${i}:00`)
      case "3days":
        return Array.from({ length: 3 }, (_, i) => `Day ${i + 1}`)
      case "week":
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      case "month":
        return Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
    }
  }

  const data = {
    labels: getLabels(),
    datasets: [
      {
        label: "Sales",
        data: generateRandomData(getLabels().length),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium mb-1">Total Sales</h3>
              <p className="text-xl font-bold">$12,345</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium mb-1">Orders</h3>
              <p className="text-xl font-bold">234</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium mb-1">Average Order Value</h3>
              <p className="text-xl font-bold">$52.76</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium mb-1">Conversion Rate</h3>
              <p className="text-xl font-bold">3.2%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Sales Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={() => setTimeFrame("1day")} variant={timeFrame === "1day" ? "default" : "outline"}>
              1 Day
            </Button>
            <Button onClick={() => setTimeFrame("3days")} variant={timeFrame === "3days" ? "default" : "outline"}>
              3 Days
            </Button>
            <Button onClick={() => setTimeFrame("week")} variant={timeFrame === "week" ? "default" : "outline"}>
              Week
            </Button>
            <Button onClick={() => setTimeFrame("month")} variant={timeFrame === "month" ? "default" : "outline"}>
              Month
            </Button>
          </div>
          {timeFrame === "1day" || timeFrame === "3days" ? (
            <Line options={options} data={data} />
          ) : (
            <Bar options={options} data={data} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

