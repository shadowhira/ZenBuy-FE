import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const category = await Category.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { error: 'Danh mục không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Lỗi lấy chi tiết danh mục' },
      { status: 500 }
    );
  }
}

const updateCategorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự').optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  parent: z.string().optional(),
  slug: z.string().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Kiểm tra quyền truy cập (chỉ admin mới có thể cập nhật danh mục)
    const user = await getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    // Kiểm tra danh mục có tồn tại không
    const category = await Category.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { error: 'Danh mục không tồn tại' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    // Cập nhật slug nếu name thay đổi
    if (validatedData.name) {
      const slug = validatedData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      validatedData.slug = slug;

      // Kiểm tra slug mới có trùng với danh mục khác không
      const existingCategory = await Category.findOne({
        slug: validatedData.slug,
        _id: { $ne: params.id }
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Danh mục với tên này đã tồn tại' },
          { status: 400 }
        );
      }
    }

    // Cập nhật danh mục
    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      { $set: validatedData },
      { new: true }
    );

    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Lỗi cập nhật danh mục' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Kiểm tra quyền truy cập (chỉ admin mới có thể xóa danh mục)
    const user = await getAuthUser(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    // Kiểm tra danh mục có tồn tại không
    const category = await Category.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { error: 'Danh mục không tồn tại' },
        { status: 404 }
      );
    }

    // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
    const Product = (await import('@/models/Product')).default;
    const productsCount = await Product.countDocuments({ category: params.id });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Không thể xóa danh mục đang có sản phẩm' },
        { status: 400 }
      );
    }

    // Kiểm tra xem có danh mục con nào không
    const childCategoriesCount = await Category.countDocuments({ parent: params.id });

    if (childCategoriesCount > 0) {
      return NextResponse.json(
        { error: 'Không thể xóa danh mục đang có danh mục con' },
        { status: 400 }
      );
    }

    // Xóa danh mục
    await Category.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Xóa danh mục thành công' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Lỗi xóa danh mục' },
      { status: 500 }
    );
  }
}