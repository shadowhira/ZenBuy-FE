import OrderStatus from "@/components/orders/order-status"
import UserProfile from "@/components/orders/user-profile"
import OrderList from "@/components/orders/order-list"

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserProfile />
      <OrderStatus />
      <OrderList />
    </div>
  )
}

