import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@lib/auth-utils";
import { getOrders } from "@lib/order-utils";
import { handleError } from "@/lib/error";
import { logger } from "@lib/logger";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Lấy danh sách đơn hàng
    const orders = await getOrders(user.id);

    // Tính toán thống kê
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((total, order) => total + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrders = orders.filter(order => order.status === "pending").length;
    const processingOrders = orders.filter(order => order.status === "processing").length;
    const shippedOrders = orders.filter(order => order.status === "shipped").length;
    const deliveredOrders = orders.filter(order => order.status === "delivered").length;
    const cancelledOrders = orders.filter(order => order.status === "cancelled").length;

    const summary = {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
    };

    logger.info("Lấy thống kê tổng quan");
    return NextResponse.json(summary);
  } catch (error) {
    return handleError(error);
  }
} 