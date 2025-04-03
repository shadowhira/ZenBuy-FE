import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAuthUser } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    // Kiểm tra người dùng đã đăng nhập chưa
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy token xác thực' },
        { status: 401 }
      );
    }

    // Tạo response với cookie hết hạn
    const response = NextResponse.json({ message: 'Đăng xuất thành công' });

    // Xóa cookie token bằng cách đặt maxAge = 0
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Cookie sẽ hết hạn ngay lập tức
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Lỗi đăng xuất' },
      { status: 500 }
    );
  }
}
