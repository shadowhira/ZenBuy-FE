import { NextRequest, NextResponse } from "next/server"
import { ensureModelsRegistered } from "@/lib/models"
import Shop from "@/models/Shop"
import dbConnect from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth-utils"
import { slugify } from "@/lib/utils"

// Ensure models are registered
ensureModelsRegistered()

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    
    // Get the current user from auth token
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Check if user already has a shop
    const existingShop = await Shop.findOne({ owner: user._id })
    
    if (existingShop) {
      return NextResponse.json(existingShop)
    }
    
    // Parse the request body
    const data = await req.json()
    const shopName = data.name || `${user.name}'s Shop`
    
    // Create a new shop
    const shop = new Shop({
      name: shopName,
      slug: slugify(shopName),
      description: data.description || `Welcome to ${shopName}`,
      logo: data.logo || "",
      banner: data.banner || "",
      owner: user._id,
    })
    
    await shop.save()
    
    return NextResponse.json(shop, { status: 201 })
  } catch (error) {
    console.error("Error creating shop:", error)
    return NextResponse.json(
      { error: "Failed to create shop" },
      { status: 500 }
    )
  }
}
