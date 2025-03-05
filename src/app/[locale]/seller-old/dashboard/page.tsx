import SellerStats from "@/components/seller/seller-stats"
import RecentOrders from "@/components/seller/recent-orders"
import TopProducts from "@/components/seller/top-products"

export default function SellerDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
      <SellerStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  )
}

