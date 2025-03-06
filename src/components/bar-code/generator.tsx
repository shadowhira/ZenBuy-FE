'use client'

// components/BarcodeGenerator.tsx
import { useState } from "react";
import { BrowserQRCodeSvgWriter, EncodeHintType } from "@zxing/library";

export default function BarcodeGenerator() {
  const [inputValue, setInputValue] = useState<string>("");
  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);

  const generateBarcode = () => {
    if (!inputValue) return;

    // Tạo mã vạch
    const writer = new BrowserQRCodeSvgWriter();
    const hints = new Map<EncodeHintType, any>(); // Optional hints (can be empty)

    // Sử dụng phương thức `write` để tạo mã vạch
    const svgElement = writer.write(inputValue, 200, 200, hints);

    // Chuyển đổi SVG thành URL
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svgString
    )}`;
    setBarcodeUrl(url);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-bold">Tạo Mã Vạch</h2>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Nhập nội dung..."
        className="p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <button
        onClick={generateBarcode}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tạo Mã Vạch
      </button>
      {barcodeUrl && (
        <div>
          <h3 className="text-lg font-semibold">Mã Vạch:</h3>
          <img src={barcodeUrl} alt="Generated Barcode" />
        </div>
      )}
    </div>
  );
}