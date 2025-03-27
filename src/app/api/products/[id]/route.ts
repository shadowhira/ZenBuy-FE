import { NextResponse } from "next/server"
import { z } from "zod"
import { Product } from "../../types"
import { handleError } from "../../error"
import { logger } from "@lib/logger"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // TODO: Thay thế bằng logic lấy chi tiết sản phẩm thực tế
    const product: Product = {
      id: params.id,
      name: "Test Product",
      description: "Test Description",
      price: 100,
      category: "test",
      images: [],
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

