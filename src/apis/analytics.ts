import { DailySales, ProductSales } from '../types';

export async function getAnalytics(timeFrame: "day" | "3days" | "week" | "month"): Promise<{
  dailySales: DailySales[];
  productSales: ProductSales[];
}> {
  const response = await fetch(`/api/analytics?timeFrame=${timeFrame}`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
} 