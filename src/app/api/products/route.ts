import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth-utils';

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  category: z.string().optional(),
  query: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? Number.parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? Number.parseFloat(val) : undefined),
  sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc']).optional(),
  featured: z.string().optional().transform(val => val === 'true'),
});

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const validatedParams = querySchema.parse(Object.fromEntries(searchParams));

    const { page, limit, category, query, minPrice, maxPrice, sort, featured } = validatedParams;

    // Xây dựng query
    const queryObj: any = {};

    if (category) {
      queryObj.category = category;
    }

    if (query) {
      queryObj.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (minPrice !== undefined) {
      queryObj.price = { ...queryObj.price, $gte: minPrice };
    }

    if (maxPrice !== undefined) {
      queryObj.price = { ...queryObj.price, $lte: maxPrice };
    }

    if (featured) {
      queryObj.featured = true;
    }

    // Xây dựng sort
    let sortObj = {};
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortObj = { price: 1 };
          break;
        case 'price_desc':
          sortObj = { price: -1 };
          break;
        case 'name_asc':
          sortObj = { title: 1 };
          break;
        case 'name_desc':
          sortObj = { title: -1 };
          break;
      }
    }

    // Thực hiện query với phân trang
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('shop', 'name');

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Lỗi lấy danh sách sản phẩm' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    // Kiểm tra quyền truy cập (chỉ seller mới có thể tạo sản phẩm)
    const user = await getAuthUser(request);

    if (!user || user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Tạo slug từ title
    const slug = body.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    // Kiểm tra xem người dùng có shop không
    const Shop = (await import('@/models/Shop')).default;
    const shop = await Shop.findOne({ owner: user._id });

    if (!shop) {
      return NextResponse.json(
        { error: 'Bạn chưa có shop, vui lòng tạo shop trước' },
        { status: 400 }
      );
    }

    // Tạo sản phẩm mới
    const product = await Product.create({
      ...body,
      slug,
      shop: shop._id,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Lỗi tạo sản phẩm' },
      { status: 500 }
    );
  }
}
