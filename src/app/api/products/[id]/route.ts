import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Product.findById(params.id)
      .populate('category', 'name slug')
      .populate('shop', 'name logo followers rating');

    if (!product) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Lỗi lấy chi tiết sản phẩm' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Kiểm tra quyền truy cập (chỉ seller mới có thể cập nhật sản phẩm)
    const user = await getAuthUser(request);

    if (!user || user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    // Kiểm tra xem người dùng có shop không
    const Shop = (await import('@/models/Shop')).default;
    const shop = await Shop.findOne({ owner: user._id });

    if (!shop) {
      return NextResponse.json(
        { error: 'Bạn chưa có shop, vui lòng tạo shop trước' },
        { status: 400 }
      );
    }

    // Kiểm tra sản phẩm có thuộc về shop của seller không
    if (product.shop.toString() !== shop._id.toString()) {
      return NextResponse.json(
        { error: 'Bạn không có quyền cập nhật sản phẩm này' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    )
      .populate('category', 'name slug')
      .populate('shop', 'name logo followers rating');

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Lỗi cập nhật sản phẩm' },
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

    // Kiểm tra quyền truy cập (chỉ seller mới có thể xóa sản phẩm)
    const user = await getAuthUser(request);

    if (!user || user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    // Kiểm tra xem người dùng có shop không
    const Shop = (await import('@/models/Shop')).default;
    const shop = await Shop.findOne({ owner: user._id });

    if (!shop) {
      return NextResponse.json(
        { error: 'Bạn chưa có shop, vui lòng tạo shop trước' },
        { status: 400 }
      );
    }

    // Kiểm tra sản phẩm có thuộc về shop của seller không
    if (product.shop.toString() !== shop._id.toString()) {
      return NextResponse.json(
        { error: 'Bạn không có quyền xóa sản phẩm này' },
        { status: 403 }
      );
    }

    // Xóa sản phẩm
    await Product.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Xóa sản phẩm thành công' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Lỗi xóa sản phẩm' },
      { status: 500 }
    );
  }
}
