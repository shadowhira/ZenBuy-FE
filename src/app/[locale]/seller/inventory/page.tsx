import InventoryForm from "@/components/seller/inventory-form"
import styles from "@/styles/seller.module.scss"

export default function InventoryPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Inventory Management</h1>
      <InventoryForm />
    </div>
  )
}

