import { DailySales, ProductSales } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.escuelajs.co/api/v1';

export async function getAnalytics(timeFrame: "day" | "3days" | "week" | "month"): Promise<{
  dailySales: DailySales[];
  productSales: ProductSales[];
}> {
  const response = await fetch(`${API_BASE_URL}/analytics?timeFrame=${timeFrame}`);
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
} 