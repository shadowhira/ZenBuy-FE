import { NextResponse } from 'next/server'
import { z } from 'zod'
import { headers } from 'next/headers'
import type { DailySales, ProductSales } from '../../../types'

const timeFrameSchema = z.enum(["day", "3days", "week", "month"]).default("week")

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
    const timeFrame = searchParams.get('timeFrame') || "week"
    
    try {
      const validatedTimeFrame = timeFrameSchema.parse(timeFrame)
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics?timeFrame=${validatedTimeFrame}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json(
          { error: error.message || "Lỗi lấy dữ liệu phân tích" },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Tham số timeFrame không hợp lệ" },
          { status: 400 }
        )
      }
      throw error
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi lấy dữ liệu phân tích" },
      { status: 500 }
    )
  }
} 