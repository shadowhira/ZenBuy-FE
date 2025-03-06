// app/api/upload-image/route.ts
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    // Lấy dữ liệu từ request
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image found in request" }, { status: 400 });
    }

    // Lưu hình ảnh vào thư mục public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${uuidv4()}${path.extname(imageFile.name)}`;
    const filePath = path.join(uploadDir, fileName);

    // Chuyển đổi File thành Buffer và lưu vào file system
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Trả về URL của hình ảnh
    const imageUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}