'use client'

import ShopHeader from "@/components/shop/shop-header"
import ShopCategories from "@/components/shop/shop-categories"
import ShopProducts from "@/components/shop/shop-products"

export default function ShopPage() {
  // Fetch shop data using params.id
  const shop = {
    id: 1,
    name: "Tech Haven",
    description: "Your one-stop shop for all things tech",
    banner: "https://th.bing.com/th/id/OIP.1Ij7KtBNY8Dkqm5oTmV2ygHaEK?w=308&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
    avatar: "https://th.bing.com/th/id/OIP.6kyJeTbWMvEdp4zvX14IFAHaHa?w=175&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
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

