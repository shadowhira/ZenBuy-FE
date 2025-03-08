import { NextResponse } from "next/server"
import { generateMockProducts } from "@lib/mock-data"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ message: "Query parameter is required" }, { status: 400 })
    }

    // Tạo dữ liệu mẫu
    const products = generateMockProducts(40)

    // Tìm kiếm sản phẩm
    const searchResults = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()),
    )

    return NextResponse.json(
      {
        products: searchResults,
        total: searchResults.length,
        page: 1,
        limit: searchResults.length,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

