import { NextResponse } from "next/server"

export async function POST() {
  try {
    // TODO: Thay thế bằng logic đăng xuất thực tế
    return NextResponse.json({ message: "Đăng xuất thành công" });
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi đăng xuất" },
      { status: 500 }
    );
  }
}

