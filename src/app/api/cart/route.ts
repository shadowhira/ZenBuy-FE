import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import { ensureModelsRegistered, Cart, Product } from '@/lib/models';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Đảm bảo tất cả các models được đăng ký
    ensureModelsRegistered();

    console.log('GET /api/cart - Authenticating user');
    const user = await getAuthUser(request);

    if (!user) {
      console.log('GET /api/cart - Authentication failed');
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    console.log('GET /api/cart - User authenticated:', user._id);

    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ user: user._id }).populate({
      path: 'items.product',
      select: 'title price images stock'
    });

    // Nếu chưa có giỏ hàng, tạo mới
    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: []
      });
    }

    // Tính toán tổng số lượng và tổng giá
    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.items.reduce((total, item) => {
      const product = item.product as any;
      return total + (product.price * item.quantity);
    }, 0);

    // Chuyển đổi dữ liệu để trả về
    const formattedItems = cart.items.map(item => {
      const product = item.product as any;
      return {
        id: item._id,
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
        variant: item.variant,
        stock: product.stock
      };
    });

    return NextResponse.json({
      items: formattedItems,
      totalItems,
      totalPrice
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Lỗi lấy giỏ hàng' },
      { status: 500 }
    );
  }
}

const updateCartSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    variant: z.string().optional()
  }))
});

export async function PUT(request: Request) {
  try {
    await dbConnect();

    // Đảm bảo tất cả các models được đăng ký
    ensureModelsRegistered();

    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateCartSchema.parse(body);

    // Kiểm tra sản phẩm có tồn tại và còn hàng không
    const cartItems = [];

    for (const item of validatedData.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `Sản phẩm với ID ${item.productId} không tồn tại` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Sản phẩm ${product.title} chỉ còn ${product.stock} sản phẩm` },
          { status: 400 }
        );
      }

      cartItems.push({
        product: item.productId,
        quantity: item.quantity,
        price: product.price,
        variant: item.variant
      });
    }

    // Cập nhật hoặc tạo giỏ hàng
    const cart = await Cart.findOneAndUpdate(
      { user: user._id },
      { items: cartItems },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: 'Cập nhật giỏ hàng thành công',
      cart
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Lỗi cập nhật giỏ hàng' },
      { status: 500 }
    );
  }
}
