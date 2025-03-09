import styles from "@styles/seller.module.scss"
import ShopEditForm from "@components/seller/shop-edit-form"
import EditProfileForm from "@components/profile/edit-profile-form"

export default function ShopEditPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Edit Shop Details</h1>
      {/* <ShopEditForm /> */}
      <EditProfileForm />
    </div>
  )
}

