import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find().sort({ name: 1 });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Lỗi lấy danh sách danh mục' },
      { status: 500 }
    );
  }
}

const categorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
  image: z.string().optional(),
  parent: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    await dbConnect();

    // Kiểm tra quyền truy cập (chỉ admin mới có thể tạo danh mục)
    const user = await getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Tạo slug từ name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    // Kiểm tra slug đã tồn tại chưa
    const existingCategory = await Category.findOne({ slug });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Danh mục đã tồn tại' },
        { status: 400 }
      );
    }

    // Tạo danh mục mới
    const category = await Category.create({
      ...validatedData,
      slug,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Lỗi tạo danh mục' },
      { status: 500 }
    );
  }
}