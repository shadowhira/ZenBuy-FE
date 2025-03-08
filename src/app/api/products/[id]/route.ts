import { NextResponse } from "next/server"
import { generateMockProducts } from "@lib/mock-data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Tạo dữ liệu mẫu
    const products = generateMockProducts(40)
    const product = products.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

