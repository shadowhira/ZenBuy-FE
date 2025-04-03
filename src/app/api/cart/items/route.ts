import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth-utils';

const addCartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  variant: z.string().optional(),
});

export async function POST(request: Request) {
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
    const validatedData = addCartItemSchema.parse(body);

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(validatedData.productId);

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

    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ user: user._id });

    // Nếu chưa có giỏ hàng, tạo mới
    if (!cart) {
      cart = new Cart({
        user: user._id,
        items: [],
      });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.items.findIndex(
      (item: any) =>
        item.product.toString() === validatedData.productId &&
        item.variant === validatedData.variant
    );

    if (existingItemIndex > -1) {
      // Nếu đã có, cập nhật số lượng
      const newQuantity = cart.items[existingItemIndex].quantity + validatedData.quantity;

      // Kiểm tra lại số lượng sau khi cộng dồn
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: `Sản phẩm chỉ còn ${product.stock} sản phẩm` },
          { status: 400 }
        );
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Nếu chưa có, thêm mới
      cart.items.push({
        product: validatedData.productId,
        quantity: validatedData.quantity,
        price: product.price,
        variant: validatedData.variant,
      });
    }

    // Lưu giỏ hàng
    await cart.save();

    return NextResponse.json(
      { message: 'Thêm sản phẩm vào giỏ hàng thành công' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Lỗi thêm sản phẩm vào giỏ hàng' },
      { status: 500 }
    );
  }
}