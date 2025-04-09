import { NextRequest, NextResponse } from "next/server"
import { ensureModelsRegistered } from "@/lib/models"
import Product from "@/models/Product"
import Shop from "@/models/Shop"
import dbConnect from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth-utils"

// Ensure models are registered
ensureModelsRegistered()

export async function GET(req: NextRequest) {
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

    // Get all products for this shop
    const products = await Product.find({ shop: shop._id })
      .populate("category")
      .sort({ createdAt: -1 })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching seller products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

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

    // Parse the request body
    const data = await req.json()
    console.log('Received product data:', data)

    // Generate slug from title
    const { slugify } = await import('@/lib/utils')
    const slug = slugify(data.title || 'product')

    // Find or create a default category if not provided
    let categoryId = data.category
    console.log('Category ID from request:', categoryId, typeof categoryId)

    // If categoryId is a string but not a valid ObjectId, we need to find the category by name or slug
    if (categoryId && typeof categoryId === 'string' && categoryId.length < 24) {
      console.log('Category ID is not a valid ObjectId, trying to find by name or slug')
      // Import Category model
      const Category = (await import('@/models/Category')).default

      // Try to find the category by name or slug
      const category = await Category.findOne({
        $or: [
          { name: categoryId },
          { slug: categoryId.toLowerCase() }
        ]
      })

      if (category) {
        console.log('Found category by name or slug:', category)
        categoryId = category._id
      } else {
        console.log('Could not find category by name or slug')
        categoryId = null
      }
    }

    if (!categoryId) {
      // Import Category model
      const Category = (await import('@/models/Category')).default

      // Find or create a default category
      let defaultCategory = await Category.findOne({ slug: 'uncategorized' })

      if (!defaultCategory) {
        defaultCategory = new Category({
          name: 'Uncategorized',
          slug: 'uncategorized',
          description: 'Default category for uncategorized products'
        })
        await defaultCategory.save()
      }

      categoryId = defaultCategory._id
    }

    // Create a new product
    const productData = {
      ...data,
      slug,
      shop: shop._id,
      category: categoryId || "uncategorized", // Use a default category ID if none provided
      stock: data.stock || 0
    }
    console.log('Creating product with data:', productData)

    // Log the category ID for debugging
    console.log('Category ID being used:', productData.category, typeof productData.category)

    const product = new Product(productData)

    await product.save()

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    // Return more detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: "Failed to create product", details: errorMessage },
      { status: 500 }
    )
  }
}
