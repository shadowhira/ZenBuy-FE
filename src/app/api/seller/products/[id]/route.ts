import { NextRequest, NextResponse } from "next/server"
import { ensureModelsRegistered } from "@/lib/models"
import Product from "@/models/Product"
import Shop from "@/models/Shop"
import dbConnect from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth-utils"
import mongoose from "mongoose"

// Ensure models are registered
ensureModelsRegistered()

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
    }).populate("category")

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    // Parse the request body
    const data = await req.json()

    // Update the product
    const product = await Product.findOneAndUpdate(
      {
        _id: params.id,
        shop: shop._id,
      },
      { $set: data },
      { new: true }
    ).populate("category")

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Delete the product
    const result = await Product.deleteOne({
      _id: params.id,
      shop: shop._id,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
