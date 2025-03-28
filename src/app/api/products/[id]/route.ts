import { NextResponse } from "next/server"
import { z } from "zod"
import type { Product } from "@/types"
import { handleError } from "@/lib/error"
import { logger } from "@lib/logger"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: Thay thế bằng logic lấy chi tiết sản phẩm thực tế
    const product: Product = {
      id: parseInt(params.id),
      title: "Test Product",
      description: "Test Description",
      price: 100,
      category: {
        id: 1,
        name: "Test Category",
        image: "/images/categories/test.jpg"
      },
      shop: {
        id: 1,
        name: "Test Shop",
        description: "Test Shop Description",
        logo: "/images/shops/test.jpg",
        rating: 4.5,
        followers: 100,
        reviews: 50,
        products: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      images: ["/images/products/test.jpg"],
      rating: 0,
      reviews: 0,
      stock: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    logger.info(`Lấy chi tiết sản phẩm ${params.id}`)
    return NextResponse.json(product)
  } catch (error) {
    return handleError(error)
  }
}

