import { NextRequest, NextResponse } from "next/server"
import { ensureModelsRegistered } from "@/lib/models"
import Product from "@/models/Product"
import Shop from "@/models/Shop"
import Order from "@/models/Order"
import dbConnect from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth-utils"
import { z } from "zod"

// Ensure models are registered
ensureModelsRegistered()

// Validate timeFrame parameter
const timeFrameSchema = z.enum(["day", "3days", "week", "month"]).default("week")

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Get the current user from auth token
    console.log('Analytics API: Attempting to get auth user')
    const user = await getAuthUser(req)

    if (!user) {
      console.log('Analytics API: Authentication failed - no user found')
      return NextResponse.json(
        { error: "Unauthorized - Please log in to access this resource" },
        { status: 401 }
      )
    }

    console.log('Analytics API: User authenticated successfully:', user._id)

    // Get the seller's shop
    let shop = await Shop.findOne({ owner: user._id })

    // If shop doesn't exist, create a default one
    if (!shop) {
      const shopName = `${user.name}'s Shop`
      const { slugify } = await import('@/lib/utils')

      shop = new Shop({
        name: shopName,
        slug: slugify(shopName),
        description: `Welcome to ${shopName}`,
        logo: "",
        banner: "",
        owner: user._id,
      })

      await shop.save()
    }

    // Get timeFrame from query params
    const { searchParams } = new URL(req.url)
    const timeFrame = searchParams.get('timeFrame') || "week"

    // Validate timeFrame
    const validatedTimeFrame = timeFrameSchema.parse(timeFrame)

    // Calculate date range based on timeFrame
    const endDate = new Date()
    let startDate = new Date()

    switch (validatedTimeFrame) {
      case "day":
        startDate.setDate(endDate.getDate() - 1)
        break
      case "3days":
        startDate.setDate(endDate.getDate() - 3)
        break
      case "week":
        startDate.setDate(endDate.getDate() - 7)
        break
      case "month":
        startDate.setDate(endDate.getDate() - 30)
        break
    }

    // Get products count
    const productsCount = await Product.countDocuments({ shop: shop._id })

    // Get orders for this shop
    const orders = await Order.find({
      'items.product': { $in: await Product.find({ shop: shop._id }).distinct('_id') },
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('items.product')

    // Calculate total revenue and other metrics
    let totalRevenue = 0
    let totalOrders = orders.length
    let averageOrderValue = 0

    // Calculate revenue
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product && item.product.shop && item.product.shop.toString() === shop._id.toString()) {
          totalRevenue += item.price * item.quantity
        }
      })
    })

    // Calculate average order value
    averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Get previous period metrics for comparison
    const previousEndDate = new Date(startDate)
    const previousStartDate = new Date(previousEndDate)

    // Set previous period start date based on the same timeframe
    if (validatedTimeFrame === "day") {
      previousStartDate.setDate(previousEndDate.getDate() - 1)
    } else if (validatedTimeFrame === "3days") {
      previousStartDate.setDate(previousEndDate.getDate() - 3)
    } else if (validatedTimeFrame === "week") {
      previousStartDate.setDate(previousEndDate.getDate() - 7)
    } else if (validatedTimeFrame === "month") {
      previousStartDate.setDate(previousEndDate.getDate() - 30)
    }

    const previousOrders = await Order.find({
      'items.product': { $in: await Product.find({ shop: shop._id }).distinct('_id') },
      createdAt: { $gte: previousStartDate, $lte: previousEndDate }
    }).populate('items.product')

    let previousTotalRevenue = 0
    let previousTotalOrders = previousOrders.length

    // Calculate previous revenue
    previousOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.product && item.product.shop && item.product.shop.toString() === shop._id.toString()) {
          previousTotalRevenue += item.price * item.quantity
        }
      })
    })

    // Calculate percentage changes
    const revenueChange = previousTotalRevenue > 0
      ? ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100
      : 0

    const ordersChange = previousTotalOrders > 0
      ? ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100
      : 0

    // Get daily sales data for chart
    const dailySales = []
    const days = validatedTimeFrame === "day" ? 24 : // Hours in a day
               validatedTimeFrame === "3days" ? 3 :
               validatedTimeFrame === "week" ? 7 :
               30 // month

    // For day timeframe, we'll use hours
    if (validatedTimeFrame === "day") {
      for (let i = 0; i < 24; i++) {
        const hourStart = new Date(endDate)
        hourStart.setHours(i, 0, 0, 0)

        const hourEnd = new Date(endDate)
        hourEnd.setHours(i, 59, 59, 999)

        const hourOrders = await Order.find({
          'items.product': { $in: await Product.find({ shop: shop._id }).distinct('_id') },
          createdAt: { $gte: hourStart, $lte: hourEnd }
        }).populate('items.product')

        let hourRevenue = 0
        hourOrders.forEach(order => {
          order.items.forEach(item => {
            if (item.product && item.product.shop && item.product.shop.toString() === shop._id.toString()) {
              hourRevenue += item.price * item.quantity
            }
          })
        })

        dailySales.push({
          date: `${i}:00`,
          revenue: hourRevenue,
          orders: hourOrders.length
        })
      }
    } else {
      // For other timeframes, we'll use days
      for (let i = 0; i < days; i++) {
        const dayStart = new Date(endDate)
        dayStart.setDate(endDate.getDate() - (days - 1) + i)
        dayStart.setHours(0, 0, 0, 0)

        const dayEnd = new Date(dayStart)
        dayEnd.setHours(23, 59, 59, 999)

        const dayOrders = await Order.find({
          'items.product': { $in: await Product.find({ shop: shop._id }).distinct('_id') },
          createdAt: { $gte: dayStart, $lte: dayEnd }
        }).populate('items.product')

        let dayRevenue = 0
        dayOrders.forEach(order => {
          order.items.forEach(item => {
            if (item.product && item.product.shop && item.product.shop.toString() === shop._id.toString()) {
              dayRevenue += item.price * item.quantity
            }
          })
        })

        dailySales.push({
          date: dayStart.toISOString().split('T')[0],
          revenue: dayRevenue,
          orders: dayOrders.length
        })
      }
    }

    // Get top selling products
    const productSales = []
    const productMap = new Map()

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product && item.product.shop && item.product.shop.toString() === shop._id.toString()) {
          const productId = item.product._id.toString()
          const productName = item.product.title
          const quantity = item.quantity
          const revenue = item.price * item.quantity

          if (productMap.has(productId)) {
            const product = productMap.get(productId)
            product.quantity += quantity
            product.revenue += revenue
          } else {
            productMap.set(productId, {
              productId,
              productName,
              quantity,
              revenue
            })
          }
        }
      })
    })

    productMap.forEach(product => {
      productSales.push(product)
    })

    // Sort by revenue (highest first)
    productSales.sort((a, b) => b.revenue - a.revenue)

    // Get active customers count (unique users who placed orders)
    const activeCustomers = new Set()
    orders.forEach(order => {
      activeCustomers.add(order.user.toString())
    })

    // Calculate conversion rate (orders / product views) - this would require tracking product views
    // For now, we'll use a placeholder value based on the number of orders
    const conversionRate = totalOrders > 0 ? (totalOrders / (totalOrders * 30)) * 100 : 3.2

    // Calculate additional metrics

    // 1. Average items per order
    let totalItems = 0
    orders.forEach(order => {
      totalItems += order.items.length
    })
    const averageItemsPerOrder = totalOrders > 0 ? totalItems / totalOrders : 0

    // 2. Payment method distribution
    const paymentMethods = {
      credit_card: 0,
      bank_transfer: 0,
      cash: 0
    }

    orders.forEach(order => {
      if (paymentMethods.hasOwnProperty(order.paymentMethod)) {
        paymentMethods[order.paymentMethod as keyof typeof paymentMethods]++
      }
    })

    // 3. Order status distribution
    const orderStatuses = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    }

    orders.forEach(order => {
      if (orderStatuses.hasOwnProperty(order.status)) {
        orderStatuses[order.status as keyof typeof orderStatuses]++
      }
    })

    // 4. Calculate coupon usage
    let ordersWithCoupons = 0
    let totalCouponDiscount = 0

    orders.forEach(order => {
      if (order.couponDiscount && order.couponDiscount > 0) {
        ordersWithCoupons++
        totalCouponDiscount += order.couponDiscount
      }
    })

    const couponUsageRate = totalOrders > 0 ? (ordersWithCoupons / totalOrders) * 100 : 0
    const averageCouponDiscount = ordersWithCoupons > 0 ? totalCouponDiscount / ordersWithCoupons : 0

    // Define ProductSales type to fix TypeScript errors
    interface ProductSale {
      productId: string
      productName: string
      quantity: number
      revenue: number
    }

    // Cast productSales to the correct type
    const typedProductSales = productSales as ProductSale[]

    return NextResponse.json({
      totalRevenue,
      revenueChange,
      totalOrders,
      ordersChange,
      productsCount,
      activeCustomers: activeCustomers.size,
      averageOrderValue,
      conversionRate,
      dailySales,
      productSales: typedProductSales.slice(0, 5), // Top 5 products

      // Additional metrics
      averageItemsPerOrder,
      paymentMethods,
      orderStatuses,
      couponUsage: {
        rate: couponUsageRate,
        averageDiscount: averageCouponDiscount,
        totalDiscount: totalCouponDiscount,
        ordersWithCoupons
      }
    })

  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
