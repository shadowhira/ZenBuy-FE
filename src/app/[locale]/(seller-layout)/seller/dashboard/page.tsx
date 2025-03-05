import RevenueChart from "@/components/seller/revenue-chart"
import styles from "@/styles/seller.module.scss"
import Dashboard from "@components/seller/dashboard"

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Seller Dashboard</h1>
      <Dashboard />
      <RevenueChart />
    </div>
  )
}

