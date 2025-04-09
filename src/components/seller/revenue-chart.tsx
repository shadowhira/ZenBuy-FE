"use client"

import { useState } from "react"
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

const generateDummyData = (days: number) => {
  return {
    labels: Array.from({ length: days }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: "Revenue",
        data: Array.from({ length: days }, () => Math.floor(Math.random() * 1000) + 500),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }
}

export default function RevenueChart() {
  const [data, setData] = useState(generateDummyData(7))

  const handleFilterChange = (days: number) => {
    setData(generateDummyData(days))
  }

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={() => handleFilterChange(1)}>1 Day</Button>
        <Button onClick={() => handleFilterChange(3)}>3 Days</Button>
        <Button onClick={() => handleFilterChange(7)}>7 Days</Button>
        <Button onClick={() => handleFilterChange(30)}>30 Days</Button>
      </div>
      <Line options={options} data={data} />
    </div>
  )
}

