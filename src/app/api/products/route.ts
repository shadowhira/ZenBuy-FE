import { NextResponse } from "next/server"
import { generateMockProducts } from "@lib/mock-data"
import { ProductsResponse } from "../types"
import { z } from "zod"

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  category: z.string().optional(),
  query: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? Number.parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? Number.parseFloat(val) : undefined),
  sort: z.enum(["price_asc", "price_desc", "name_asc", "name_desc"]).optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const validatedParams = querySchema.parse(Object.fromEntries(searchParams))

    const { page, limit, category, query, minPrice, maxPrice, sort } = validatedParams

    // Tạo dữ liệu mẫu
    let products = generateMockProducts(40)

    // Lọc theo category nếu có
    if (category) {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }

    // Lọc theo query nếu có
    if (query) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Lọc theo giá nếu có
    if (minPrice !== undefined) {
      products = products.filter((p) => p.price >= minPrice)
    }
    if (maxPrice !== undefined) {
      products = products.filter((p) => p.price <= maxPrice)
    }

    // Sắp xếp nếu có
    if (sort) {
      if (sort === "price_asc") {
        products.sort((a, b) => a.price - b.price)
      } else if (sort === "price_desc") {
        products.sort((a, b) => b.price - a.price)
      } else if (sort === "name_asc") {
        products.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sort === "name_desc") {
        products.sort((a, b) => b.name.localeCompare(a.name))
      }
    }

    // Phân trang
    const total = products.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = products.slice(startIndex, endIndex)

    const response: ProductsResponse = {
      products: paginatedProducts,
      total,
      page,
      limit,
    }
    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Lỗi lấy danh sách sản phẩm" },
      { status: 500 }
    )
  }
}

