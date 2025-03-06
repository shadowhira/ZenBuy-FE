'use client'

// components/BarcodeGenerator.tsx
import { useState } from "react";
import { BrowserQRCodeSvgWriter, EncodeHintType } from "@zxing/library";

interface BarcodeData {
  productName: string;
  sku: string;
  quantity: string;
  unitPrice: string;
  supplier: string;
  notes: string;
  imageUrls: string[]; // Lưu trữ đường dẫn hình ảnh
}

export default function BarcodeGenerator() {
  const [barcodeData, setBarcodeData] = useState<BarcodeData>({
    productName: "",
    sku: "",
    quantity: "",
    unitPrice: "",
    supplier: "",
    notes: "",
    imageUrls: [],
  });
  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBarcodeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setLoading(true);
    const files = Array.from(e.target.files);

    try {
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadImageToServer(file))
      );
      console.log('imageUrls: ', uploadedUrls);

      setBarcodeData((prev) => ({
        ...prev,
        imageUrls: uploadedUrls,
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    // Gọi API để tải hình ảnh lên server
    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });
    console.log('response: ', response);

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url; // Trả về URL của hình ảnh
  };

  const generateBarcode = () => {
    // Chuyển đổi dữ liệu thành chuỗi JSON
    const dataString = JSON.stringify(barcodeData);

    // Tạo mã vạch
    const writer = new BrowserQRCodeSvgWriter();
    const hints = new Map<EncodeHintType, any>(); // Optional hints (can be empty)

    // Sử dụng phương thức `write` để tạo mã vạch
    const svgElement = writer.write(dataString, 200, 200, hints);

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svgString
    )}`;
    setBarcodeUrl(url);
    console.log('url: ', url);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-bold">Tạo Mã Vạch</h2>

      {/* Trường Nhập Dữ Liệu */}
      <input
        type="text"
        name="productName"
        value={barcodeData.productName}
        onChange={handleInputChange}
        placeholder="Tên sản phẩm"
        className="p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <input
        type="text"
        name="sku"
        value={barcodeData.sku}
        onChange={handleInputChange}
        placeholder="SKU"
        className="p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <input
        type="text"
        name="quantity"
        value={barcodeData.quantity}
        onChange={handleInputChange}
        placeholder="Số lượng"
        className="p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <input
        type="text"
        name="unitPrice"
        value={barcodeData.unitPrice}
        onChange={handleInputChange}
        placeholder="Giá đơn vị"
        className="p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <input
        type="text"
        name="supplier"
        value={barcodeData.supplier}
        onChange={handleInputChange}
        placeholder="Nhà cung cấp"
        className="p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <textarea
        name="notes"
        value={barcodeData.notes}
        onChange={handleInputChange}
        placeholder="Ghi chú"
        className="p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="p-2 border border-gray-300 rounded w-full max-w-md"
        title="Upload images"
      />

      {/* Nút Tạo Mã Vạch */}
      <button
        onClick={generateBarcode}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Đang xử lý..." : "Tạo Mã Vạch"}
      </button>

      {/* Hiển Thị Mã Vạch */}
      {barcodeUrl && (
        <div>
          <h3 className="text-lg font-semibold">Mã Vạch:</h3>
          <img src={barcodeUrl} alt="Generated Barcode" />
        </div>
      )}
    </div>
  );
}