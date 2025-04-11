import type { DailySales, ProductSales } from "src/types";

export interface PaymentMethodDistribution {
  credit_card: number;
  bank_transfer: number;
  cash: number;
}

export interface OrderStatusDistribution {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface CouponUsage {
  rate: number;
  averageDiscount: number;
  totalDiscount: number;
  ordersWithCoupons: number;
}

export interface AnalyticsState {
  dailySales: DailySales[];
  productSales: ProductSales[];
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  productsCount: number;
  activeCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  averageItemsPerOrder: number;
  paymentMethods: PaymentMethodDistribution;
  orderStatuses: OrderStatusDistribution;
  couponUsage: CouponUsage;
  timeFrame: "day" | "3days" | "week" | "month";
  isLoading: boolean;
  error: string | null;
}

