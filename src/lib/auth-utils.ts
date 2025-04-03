import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import User from '@/models/User';
import dbConnect from './mongodb';
import type { IUser } from '@/models/User';

export async function getAuthUser(request: NextRequest | Request): Promise<IUser | null> {
  // Lấy token từ Authorization header
  const authHeader = request.headers.get('Authorization');
  let token = authHeader ? authHeader.replace('Bearer ', '') : null;

  // Nếu không có token trong header, thử lấy từ cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value ?? null;
    } catch (error) {
      // Xử lý trường hợp không thể truy cập cookies (ví dụ: trong API routes)
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        token = cookies['token'];
      }
    }
  }

  if (!token) {
    return null;
  }

  // Xác thực token
  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    return null;
  }

  try {
    // Kết nối database
    await dbConnect();

    // Tìm user theo id từ token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

