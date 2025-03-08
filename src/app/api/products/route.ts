import { NextResponse } from "next/server"
import { generateMockProducts } from "@lib/mock-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const query = searchParams.get("query")
    const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
    const sort = searchParams.get("sort")

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

    return NextResponse.json(
      {
        products: paginatedProducts,
        total,
        page,
        limit,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

