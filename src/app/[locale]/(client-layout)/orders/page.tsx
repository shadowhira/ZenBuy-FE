"use client"

import { useState, useEffect } from "react"
import OrderStatus from "@components/orders/order-status"
import UserProfile from "@components/orders/user-profile"
import OrderListConnected from "@components/orders/order-list-connected"
// TempLogin đã được xóa
import { useTranslation } from "react-i18next"

export default function OrdersPage() {
  const { t } = useTranslation("orders");
  // Chỉ sử dụng API data
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserProfile />
      <OrderStatus />

      {!isAuthenticated ? (
        <div className="mt-8 mb-4">
          <p className="text-muted-foreground">{t("loginRequired") || "Please login to view your orders"}</p>
        </div>
      ) : (
        <div className="mt-8">
          <OrderListConnected />
        </div>
      )}
    </div>
  )
}

