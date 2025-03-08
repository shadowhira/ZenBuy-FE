import styles from "@styles/seller.module.scss"
import ShopEditForm from "@components/seller/shop-edit-form"

export default function ShopEditPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Edit Shop Details</h1>
      <ShopEditForm />
    </div>
  )
}

