import ShopHeader from "@/src/components/shop/shop-header"
import ShopCategories from "@/src/components/shop/shop-categories"
import ShopProducts from "@/src/components/shop/shop-products"

export default function ShopPage({ params }: { params: { id: string } }) {
  // Fetch shop data using params.id
  const shop = {
    id: params.id,
    name: "Tech Haven",
    description: "Your one-stop shop for all things tech",
    banner: "/shop-banner.jpg",
    avatar: "/shop-avatar.jpg",
    followers: 5678,
    rating: 4.8,
  }

  return (
    <div>
      <ShopHeader shop={shop} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShopCategories />
        <ShopProducts />
      </div>
    </div>
  )
}

