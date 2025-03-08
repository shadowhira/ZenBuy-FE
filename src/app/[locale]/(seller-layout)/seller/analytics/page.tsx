"use client"

import SalesAnalysis from "@components/seller/sales-analysis"
import styles from "@styles/seller.module.scss"

export default function AnalyticsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Sales Analytics</h1>
      <SalesAnalysis />
    </div>
  )
}

