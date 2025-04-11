import { NextResponse } from "next/server"
import { ensureModelsRegistered } from "@/lib/models"
import Product from "@/models/Product"
import Shop from "@/models/Shop"
import Order from "@/models/Order"
import User from "@/models/User"
import Category from "@/models/Category"
import dbConnect from "@/lib/mongodb"
import { faker } from "@faker-js/faker"
import mongoose from "mongoose"

// Ensure models are registered
ensureModelsRegistered()

export async function GET(req: Request) {
  try {
    await dbConnect()

    // Check if force parameter is provided
    const { searchParams } = new URL(req.url)
    const force = searchParams.get('force') === 'true'

    // Check if we already have seed data
    const existingOrders = await Order.countDocuments()
    if (existingOrders > 0 && !force) {
      return NextResponse.json({
        message: "Seed data already exists",
        ordersCount: existingOrders,
        hint: "Use ?force=true to recreate seed data"
      })
    }

    // If force=true and there are existing orders, delete them first
    if (force && existingOrders > 0) {
      await Order.deleteMany({})
      console.log(`Deleted ${existingOrders} existing orders before reseeding`)
    }

    // Get all users
    const users = await User.find()
    if (users.length === 0) {
      return NextResponse.json(
        { error: "No users found. Please seed users first." },
        { status: 400 }
      )
    }

    // Get all shops
    const shops = await Shop.find()
    if (shops.length === 0) {
      return NextResponse.json(
        { error: "No shops found. Please seed shops first." },
        { status: 400 }
      )
    }

    // Get all products
    const products = await Product.find()
    if (products.length === 0) {
      return NextResponse.json(
        { error: "No products found. Please seed products first." },
        { status: 400 }
      )
    }

    // Get all categories
    const categories = await Category.find()
    if (categories.length === 0) {
      return NextResponse.json(
        { error: "No categories found. Please seed categories first." },
        { status: 400 }
      )
    }

    // Create orders for the past 90 days to have more historical data
    const orders = []
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 90)

    // Create between 200-300 orders for richer data
    const numOrders = faker.number.int({ min: 200, max: 300 })

    for (let i = 0; i < numOrders; i++) {
      // Random date in the past 90 days
      const orderDate = faker.date.between({ from: startDate, to: endDate })

      // Random user
      const user = users[faker.number.int({ min: 0, max: users.length - 1 })]

      // Random number of items (1-8) for more variety
      const numItems = faker.number.int({ min: 1, max: 8 })
      const items = []
      let totalAmount = 0

      for (let j = 0; j < numItems; j++) {
        // Random product
        const product = products[faker.number.int({ min: 0, max: products.length - 1 })]

        // Random quantity (1-5) for more variety
        const quantity = faker.number.int({ min: 1, max: 5 })

        // Calculate price (use product price or random if not available)
        const price = product.price || faker.number.float({ min: 10, max: 200, precision: 0.01 })

        // Add to total
        totalAmount += price * quantity

        items.push({
          product: product._id,
          quantity,
          price
        })
      }

      // Create shipping address
      const shippingAddress = {
        fullName: user.name,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        zipCode: faker.location.zipCode(),
        phone: faker.phone.number()
      }

      // Random payment method
      const paymentMethods = ["credit_card", "bank_transfer", "cash"]
      const paymentMethod = paymentMethods[faker.number.int({ min: 0, max: 2 })] as "credit_card" | "bank_transfer" | "cash"

      // Random status (weighted towards completed statuses)
      const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

      // Adjust weights based on order date
      let statusWeights = [0.1, 0.2, 0.2, 0.4, 0.1] // Default: 40% delivered, 10% cancelled, etc.

      // For recent orders (last 7 days), more likely to be pending/processing
      const daysDiff = Math.floor((endDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= 7) {
        statusWeights = [0.4, 0.3, 0.2, 0.05, 0.05] // Recent orders: mostly pending/processing
      } else if (daysDiff <= 14) {
        statusWeights = [0.1, 0.3, 0.4, 0.15, 0.05] // Orders 7-14 days old: mostly processing/shipped
      } else if (daysDiff <= 30) {
        statusWeights = [0.05, 0.1, 0.2, 0.55, 0.1] // Orders 14-30 days old: mostly delivered
      }

      let statusIndex = 0
      const random = Math.random()
      let cumulativeWeight = 0

      for (let k = 0; k < statusWeights.length; k++) {
        cumulativeWeight += statusWeights[k]
        if (random < cumulativeWeight) {
          statusIndex = k
          break
        }
      }

      const status = statuses[statusIndex] as "pending" | "processing" | "shipped" | "delivered" | "cancelled"

      // Add coupon discount for some orders (20% chance)
      let couponDiscount = 0
      if (faker.number.int({ min: 1, max: 5 }) === 1) { // 20% chance
        couponDiscount = totalAmount * faker.number.float({ min: 0.05, max: 0.2, precision: 0.01 }) // 5-20% discount
        totalAmount = totalAmount - couponDiscount
      }

      // Create order
      const order = new Order({
        user: user._id,
        items,
        totalAmount,
        couponDiscount: couponDiscount > 0 ? couponDiscount : undefined,
        couponCode: couponDiscount > 0 ? faker.string.alphanumeric(8).toUpperCase() : undefined,
        shippingAddress,
        paymentMethod,
        status,
        createdAt: orderDate,
        updatedAt: orderDate
      })

      await order.save()
      orders.push(order)
    }

    return NextResponse.json({
      message: "Analytics seed data created successfully",
      ordersCount: orders.length
    })
  } catch (error) {
    console.error("Error seeding analytics data:", error)
    return NextResponse.json(
      { error: "Failed to seed analytics data" },
      { status: 500 }
    )
  }
}
