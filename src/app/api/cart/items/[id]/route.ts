import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth-utils';

const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateCartItemSchema.parse(body);

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return NextResponse.json(
        { error: 'Giỏ hàng không tồn tại' },
        { status: 404 }
      );
    }

    // Tìm item trong giỏ hàng
    const itemIndex = cart.items.findIndex(
      (item: any) => item._id.toString() === params.id
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại trong giỏ hàng' },
        { status: 404 }
      );
    }

    // Lấy thông tin sản phẩm để kiểm tra số lượng
    const productId = cart.items[itemIndex].product;
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      );
    }

    // Kiểm tra số lượng sản phẩm còn đủ không
    if (product.stock < validatedData.quantity) {
      return NextResponse.json(
        { error: `Sản phẩm chỉ còn ${product.stock} sản phẩm` },
        { status: 400 }
      );
    }

    // Cập nhật số lượng
    cart.items[itemIndex].quantity = validatedData.quantity;

    // Lưu giỏ hàng
    await cart.save();

    return NextResponse.json({
      message: 'Cập nhật giỏ hàng thành công',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Lỗi cập nhật giỏ hàng' },
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

    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return NextResponse.json(
        { error: 'Giỏ hàng không tồn tại' },
        { status: 404 }
      );
    }

    // Tìm item trong giỏ hàng
    const itemIndex = cart.items.findIndex(
      (item: any) => item._id.toString() === params.id
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại trong giỏ hàng' },
        { status: 404 }
      );
    }

    // Xóa item khỏi giỏ hàng
    cart.items.splice(itemIndex, 1);

    // Lưu giỏ hàng
    await cart.save();

    return NextResponse.json({
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
    });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: 'Lỗi xóa sản phẩm khỏi giỏ hàng' },
      { status: 500 }
    );
  }
}