import ProductForm from "@components/seller/product-form"
import styles from "@styles/seller.module.scss"

export default function ProductsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Add New Product</h1>
      <ProductForm />
    </div>
  )
}

