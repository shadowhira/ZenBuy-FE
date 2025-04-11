import { DailySales, ProductSales } from '../types';

interface PaymentMethodDistribution {
  credit_card: number;
  bank_transfer: number;
  cash: number;
}

interface OrderStatusDistribution {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface CouponUsage {
  rate: number;
  averageDiscount: number;
  totalDiscount: number;
  ordersWithCoupons: number;
}

interface AnalyticsResponse {
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
  averageItemsPerOrder?: number;
  paymentMethods?: PaymentMethodDistribution;
  orderStatuses?: OrderStatusDistribution;
  couponUsage?: CouponUsage;
}

export async function getAnalytics(timeFrame: "day" | "3days" | "week" | "month"): Promise<AnalyticsResponse> {
  try {
    const response = await fetch(`/api/seller/analytics?timeFrame=${timeFrame}`, {
      credentials: 'include', // Include cookies in the request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch analytics: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}