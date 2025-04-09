import ShopEditForm from "@components/seller/shop-edit-form"
import EditProfileForm from "@components/profile/edit-profile-form"

export default function ShopEditPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Shop Details</h1>
      {/* <ShopEditForm /> */}
      <EditProfileForm />
    </div>
  )
}

