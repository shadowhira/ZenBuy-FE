import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import User from '@/models/User';
import dbConnect from './mongodb';
import type { IUser } from '@/models/User';

export async function getAuthUser(request: NextRequest | Request): Promise<IUser | null> {
  console.log('getAuthUser - Starting authentication');

  // Lấy token từ Authorization header
  const authHeader = request.headers.get('Authorization');
  let token = authHeader ? authHeader.replace('Bearer ', '') : null;
  console.log('getAuthUser - Token from Authorization header:', token ? 'Found' : 'Not found');

  // Nếu không có token trong header, thử lấy từ cookie
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value ?? null;
      console.log('getAuthUser - Token from cookies():', token ? 'Found' : 'Not found');
    } catch (error) {
      console.log('getAuthUser - Error accessing cookies(), trying cookie header');
      // Xử lý trường hợp không thể truy cập cookies (ví dụ: trong API routes)
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        console.log('getAuthUser - Cookie header:', cookieHeader);
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        token = cookies['token'];
        console.log('getAuthUser - Token from cookie header:', token ? 'Found' : 'Not found');
      }
    }
  }

  if (!token) {
    console.log('getAuthUser - No token found');
    return null;
  }

  // Xác thực token
  console.log('getAuthUser - Verifying token');
  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    console.log('getAuthUser - Invalid token');
    return null;
  }

  console.log('getAuthUser - Token verified, user ID:', decoded.id);

  try {
    // Kết nối database
    console.log('getAuthUser - Connecting to database');
    await dbConnect();

    // Tìm user theo id từ token
    console.log('getAuthUser - Finding user with ID:', decoded.id);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('getAuthUser - User not found');
      return null;
    }

    console.log('getAuthUser - User found:', user._id);
    return user;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

