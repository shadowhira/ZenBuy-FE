import InventoryForm from "@components/seller/inventory-form"
import { cn } from "@lib/utils"
import styles from "@styles/seller.module.scss"

export default function InventoryPage() {
  return (
    <div className={cn(styles.page, "items-center")}>
      <InventoryForm />
    </div>
  )
}

