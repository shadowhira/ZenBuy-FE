import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import { ensureModelsRegistered, Order } from '@/lib/models';
import { getAuthUser } from '@/lib/auth-utils';

const updateOrderSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Lấy chi tiết đơn hàng
    const order = await Order.findById(params.id)
      .populate('items.product', 'title price images')
      .populate('user', 'name email');

    if (!order) {
      return NextResponse.json(
        { error: 'Đơn hàng không tồn tại' },
        { status: 404 }
      );
    }

    // Kiểm tra quyền truy cập (chỉ người dùng tạo đơn hàng hoặc admin mới có thể xem)
    if (order.user._id.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Không có quyền truy cập đơn hàng này' },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Lỗi lấy chi tiết đơn hàng' },
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

    // Đảm bảo tất cả các models được đăng ký
    ensureModelsRegistered();

    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
        { status: 401 }
      );
    }

    // Chỉ admin hoặc seller mới có thể cập nhật trạng thái đơn hàng
    if (user.role !== 'admin' && user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Không có quyền cập nhật đơn hàng' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateOrderSchema.parse(body);

    // Tìm đơn hàng
    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { error: 'Đơn hàng không tồn tại' },
        { status: 404 }
      );
    }

    // Cập nhật trạng thái đơn hàng
    order.status = validatedData.status;
    await order.save();

    return NextResponse.json({
      message: 'Cập nhật đơn hàng thành công',
      order,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Lỗi cập nhật đơn hàng' },
      { status: 500 }
    );
  }
}