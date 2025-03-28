import { NextResponse } from 'next/server'
import { z } from 'zod'
import { headers } from 'next/headers'
import type { 
  InventoryItem, 
  UpdateInventoryItemRequest 
} from '../../../../types'

const updateInventorySchema = z.object({
  productName: z.string().min(1, "Tên sản phẩm không được để trống").optional(),
  sku: z.string().min(1, "SKU không được để trống").optional(),
  quantity: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0").optional(),
  unitPrice: z.number().min(0, "Đơn giá phải lớn hơn hoặc bằng 0").optional(),
  supplier: z.string().min(1, "Nhà cung cấp không được để trống").optional(),
  notes: z.string().optional(),
  images: z.array(z.string().url("URL hình ảnh không hợp lệ")).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = await headers()
    const token = headersList.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực" },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/${params.id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || "Lỗi lấy thông tin sản phẩm" },
        { status: response.status }
      )
    }

    const data: InventoryItem = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy thông tin sản phẩm" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const validatedData = updateInventorySchema.parse(body)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/${params.id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || "Lỗi cập nhật sản phẩm" },
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
      { error: "Lỗi cập nhật sản phẩm" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = await headers()
    const token = headersList.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: "Không tìm thấy token xác thực" },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/inventory/${params.id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || "Lỗi xóa sản phẩm" },
        { status: response.status }
      )
    }

    return NextResponse.json({ message: "Xóa sản phẩm thành công" })
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi xóa sản phẩm" },
      { status: 500 }
    )
  }
} 