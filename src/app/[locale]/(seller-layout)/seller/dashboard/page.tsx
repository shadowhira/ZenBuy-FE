"use client"

import Dashboard from "@components/seller/dashboard"
import { useTranslation } from "react-i18next"

export default function DashboardPage() {
  const { t } = useTranslation("seller-dashboard")

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("sellerDashboard")}</h1>
      <Dashboard />
    </div>
  )
}

