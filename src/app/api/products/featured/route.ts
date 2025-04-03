import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    // Lấy các sản phẩm được đánh dấu là nổi bật
    const featuredProducts = await Product.find({ featured: true })
      .limit(8)
      .populate('category', 'name slug')
      .populate('shop', 'name');

    return NextResponse.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Lỗi lấy sản phẩm nổi bật' },
      { status: 500 }
    );
  }
}
