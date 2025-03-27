import { NextResponse } from 'next/server'
import type { InventoryItem } from '../types'

export async function GET() {
  try {
    // TODO: Implement real API call to backend
    const items: InventoryItem[] = []
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const item = await request.json()
    // TODO: Implement real API call to backend
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return NextResponse.json(newItem)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add inventory item' },
      { status: 500 }
    )
  }
} 