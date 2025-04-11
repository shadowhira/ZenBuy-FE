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
const variantUpdateSchema = z.object({
  name: z.string().min(1, "Variant name is required").optional(),
  price: z.number().min(0, "Price must be a positive number").optional(),
  stock: z.number().int().min(0, "Stock must be a non-negative integer").optional(),
  attributes: z.record(z.string(), z.string()).optional(),
})

// GET a specific variant
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string, variantId: string } }
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

    // Find the variant
    const variant = product.variants?.find(v => v._id.toString() === params.variantId)

    if (!variant) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(variant)
  } catch (error) {
    console.error("Error fetching variant:", error)
    return NextResponse.json(
      { error: "Failed to fetch variant" },
      { status: 500 }
    )
  }
}

// PUT (update) a specific variant
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string, variantId: string } }
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
      const validatedData = variantUpdateSchema.parse(data)
      
      // Find the variant index
      const variantIndex = product.variants?.findIndex(v => v._id.toString() === params.variantId)
      
      if (variantIndex === undefined || variantIndex === -1 || !product.variants) {
        return NextResponse.json(
          { error: "Variant not found" },
          { status: 404 }
        )
      }
      
      // Update the variant
      product.variants[variantIndex] = {
        ...product.variants[variantIndex],
        ...validatedData
      }
      
      await product.save()
      
      return NextResponse.json(product.variants[variantIndex])
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
    console.error("Error updating variant:", error)
    return NextResponse.json(
      { error: "Failed to update variant" },
      { status: 500 }
    )
  }
}

// DELETE a specific variant
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string, variantId: string } }
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

    // Find the variant index
    const variantIndex = product.variants?.findIndex(v => v._id.toString() === params.variantId)
    
    if (variantIndex === undefined || variantIndex === -1 || !product.variants) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      )
    }
    
    // Remove the variant
    product.variants.splice(variantIndex, 1)
    await product.save()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting variant:", error)
    return NextResponse.json(
      { error: "Failed to delete variant" },
      { status: 500 }
    )
  }
}
