import { NextResponse } from 'next/server'
import { z } from 'zod'
import { headers } from 'next/headers'
import type { 
  InventoryItem, 
  CreateInventoryItemRequest, 
  UpdateInventoryItemRequest, 
  InventoryResponse 
} from '../../../types'

const createInventorySchema = z.object({
  productName: z.string().min(1, "Tên sản phẩm không được để trống"),
  sku: z.string().min(1, "SKU không được để trống"),
  quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  unitPrice: z.number().min(0, "Đơn giá phải lớn hơn hoặc bằng 0"),
  supplier: z.string().min(1, "Nhà cung cấp không được để trống"),
  notes: z.string().optional(),
  images: z.array(z.string().url("URL hình ảnh không hợp lệ")),
})

export async function GET(request: Request) {
  try {
    const headersList = await headers()
    const token = headersList.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || "Lỗi lấy danh sách kho" },
        { status: response.status }
      )
    }

    const data: InventoryResponse = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy danh sách kho" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const token = headersList.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createInventorySchema.parse(body)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || "Lỗi thêm sản phẩm vào kho" },
        { status: response.status }
      )
    }

    const data: InventoryItem = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Lỗi thêm sản phẩm vào kho" },
      { status: 500 }
    )
  }
} 