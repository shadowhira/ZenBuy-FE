import ProductForm from "@/components/seller/product-form"
import styles from "@/styles/seller.module.scss"
import BarcodeScannerCamera from "@components/bar-code/scanner-camera"
import BarcodeScannerImage from "@components/bar-code/scanner-image"

export default function ProductsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Add New Product</h1>
            <BarcodeScannerCamera />
            <BarcodeScannerImage />
      <ProductForm />
    </div>
  )
}

