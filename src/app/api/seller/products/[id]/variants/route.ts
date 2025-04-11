import { NextRequest, NextResponse } from "next/server"
import { ensureModelsRegistered } from "@/lib/models"
import Product from "@/models/Product"
import Shop from "@/models/Shop"
import dbConnect from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth-utils"
import mongoose from "mongoose"
import { z } from "zod"

// Ensure models are registered
ensureModelsRegistered()

// Validate variant data
const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  attributes: z.record(z.string(), z.string()),
})

// GET all variants for a product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      )
    }

    // Get the product
    const product = await Product.findOne({
      _id: params.id,
      shop: shop._id,
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Return variants
    return NextResponse.json(product.variants || [])
  } catch (error) {
    console.error("Error fetching variants:", error)
    return NextResponse.json(
      { error: "Failed to fetch variants" },
      { status: 500 }
    )
  }
}

// POST a new variant
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      )
    }

    // Get the product
    const product = await Product.findOne({
      _id: params.id,
      shop: shop._id,
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Parse and validate the request body
    const data = await req.json()
    
    try {
      const validatedData = variantSchema.parse(data)
      
      // Create a new variant
      const variant = {
        _id: new mongoose.Types.ObjectId(),
        ...validatedData
      }
      
      // Add the variant to the product
      if (!product.variants) {
        product.variants = []
      }
      
      product.variants.push(variant)
      await product.save()
      
      return NextResponse.json(variant, { status: 201 })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: validationError.errors },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    console.error("Error creating variant:", error)
    return NextResponse.json(
      { error: "Failed to create variant" },
      { status: 500 }
    )
  }
}
