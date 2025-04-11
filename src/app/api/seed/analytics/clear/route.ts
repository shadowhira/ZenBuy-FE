import { NextResponse } from "next/server"
import { ensureModelsRegistered } from "@/lib/models"
import Order from "@/models/Order"
import dbConnect from "@/lib/mongodb"

// Ensure models are registered
ensureModelsRegistered()

export async function GET() {
  try {
    await dbConnect()

    // Count existing orders
    const existingOrders = await Order.countDocuments()
    
    // Delete all orders
    await Order.deleteMany({})
    
    return NextResponse.json({
      message: "Analytics data cleared successfully",
      deletedOrders: existingOrders
    })
  } catch (error) {
    console.error("Error clearing analytics data:", error)
    return NextResponse.json(
      { error: "Failed to clear analytics data" },
      { status: 500 }
    )
  }
}
