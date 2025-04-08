"use client"

import { useState, useEffect } from "react"
import CartItemsConnected from "@components/cart/cart-items-connected"
import CartSummaryConnected from "@components/cart/cart-summary-connected"
import RecommendedProducts from "@components/cart/recommended-products"
// TempLogin đã được xóa
import { useTranslation } from "react-i18next"

export default function CartPage() {
  const { t } = useTranslation("cart");
  // Chỉ sử dụng API data
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-4">{t("yourCart") || "Your Shopping Cart"}</h1>

      {!isAuthenticated && (
        <div className="mb-4">
          <p className="text-muted-foreground">{t("loginRequired") || "Please login to view your cart"}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItemsConnected />
        </div>
        <div className="lg:col-span-1">
          <CartSummaryConnected />
        </div>
      </div>

      <div className="mt-16">
        <RecommendedProducts />
      </div>
    </div>
  )
}

