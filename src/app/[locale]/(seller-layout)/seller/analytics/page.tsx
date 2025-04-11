"use client"

import SalesAnalysis from "@components/seller/sales-analysis"
import { useTranslation } from "react-i18next"

export default function AnalyticsPage() {
  const { t } = useTranslation("seller-analytics")

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("salesAnalysis")}</h1>
      <SalesAnalysis />
    </div>
  )
}

