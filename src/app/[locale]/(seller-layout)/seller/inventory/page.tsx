import InventoryForm from "@/components/seller/inventory-form"
import styles from "@/styles/seller.module.scss"
import BarcodeGeneratorInventory from "@components/bar-code/generator-inventory"
import BarcodeScannerCamera from "@components/bar-code/scanner-camera"

export default function InventoryPage() {
  return (
    <div className={styles.page}>
      {/* <BarcodeScannerCamera />
      <BarcodeGeneratorInventory /> */}
      <InventoryForm />
    </div>
  )
}

