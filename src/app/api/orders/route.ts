import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import { ensureModelsRegistered, Order, Cart, Product } from '@/lib/models';
import { getAuthUser } from '@/lib/auth-utils';

// Schema cho địa chỉ giao hàng
const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Tên người nhận phải có ít nhất 2 ký tự'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  city: z.string().min(2, 'Tên thành phố phải có ít nhất 2 ký tự'),
  state: z.string().min(2, 'Tên tỉnh/thành phố phải có ít nhất 2 ký tự'),
  country: z.string().min(2, 'Tên quốc gia phải có ít nhất 2 ký tự'),
  zipCode: z.string().min(2, 'Mã bưu điện phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 ký tự'),
});

// Schema cho tạo đơn hàng
const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'cash']),
});

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Đảm bảo tất cả các models được đăng ký
    ensureModelsRegistered();

    console.log('GET /api/orders - Authenticating user');
    const user = await getAuthUser(request);

    if (!user) {
      console.log('GET /api/orders - Authentication failed');
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    console.log('GET /api/orders - User authenticated:', user._id);

    // Lấy tham số từ URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Lấy danh sách đơn hàng của người dùng
    const total = await Order.countDocuments({ user: user._id });
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product', 'title images');

    return NextResponse.json({
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Lỗi lấy danh sách đơn hàng' },
      { status: 500 }
    );
  }
}

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
    const validatedData = createOrderSchema.parse(body);

    // Lấy giỏ hàng của người dùng
    const cart = await Cart.findOne({ user: user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Giỏ hàng trống' },
        { status: 400 }
      );
    }

    // Kiểm tra số lượng sản phẩm còn đủ không
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product as any);

      if (!product) {
        return NextResponse.json(
          { error: `Sản phẩm không tồn tại` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Sản phẩm ${product.title} chỉ còn ${product.stock} sản phẩm` },
          { status: 400 }
        );
      }

      // Cập nhật số lượng sản phẩm
      product.stock -= item.quantity;
      await product.save();

      // Thêm vào danh sách sản phẩm đơn hàng
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
      });

      // Tính tổng tiền
      totalAmount += item.price * item.quantity;
    }

    // Tạo đơn hàng mới
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      totalAmount,
      shippingAddress: validatedData.shippingAddress,
      paymentMethod: validatedData.paymentMethod,
      status: 'pending',
    });

    // Xóa giỏ hàng
    cart.items = [];
    await cart.save();

    return NextResponse.json(
      {
        message: 'Đặt hàng thành công',
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Lỗi tạo đơn hàng' },
      { status: 500 }
    );
  }
}