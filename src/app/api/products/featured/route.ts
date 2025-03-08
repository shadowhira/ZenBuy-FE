import { NextResponse } from "next/server"
import { generateMockProducts } from "@lib/mock-data"

export async function GET() {
  try {
    // Tạo dữ liệu mẫu
    const products = generateMockProducts(40)

    // Lấy 8 sản phẩm đầu tiên làm sản phẩm nổi bật
    const featuredProducts = products.slice(0, 8)

    return NextResponse.json(featuredProducts, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

