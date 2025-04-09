"use client"

import SalesAnalysis from "@components/seller/sales-analysis"

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sales Analytics</h1>
      <SalesAnalysis />
    </div>
  )
}

