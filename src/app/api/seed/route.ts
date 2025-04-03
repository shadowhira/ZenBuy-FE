import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-data';

export async function GET() {
  // Chỉ cho phép chạy trong môi trường development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Route này chỉ khả dụng trong môi trường development' },
      { status: 403 }
    );
  }
  
  try {
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json({
        message: result.message,
        stats: result.stats,
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
