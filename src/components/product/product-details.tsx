"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import VanillaTilt from "vanilla-tilt"; // Import vanilla-tilt
import { Star, Truck, ShoppingCart } from "lucide-react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useTranslation } from "react-i18next";
import type { Product } from "@/types";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { t } = useTranslation("detail-product");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Thêm ref cho ảnh chính
  const tiltRef = useRef<HTMLDivElement & { vanillaTilt?: VanillaTilt }>(null);

  // Cập nhật mainImage khi product thay đổi
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product.images]);

  // Khởi tạo hiệu ứng tilt khi component mount
  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 10, // Góc nghiêng tối đa
        speed: 200, // Tốc độ hiệu ứng
        glare: true, // Hiệu ứng ánh sáng phản chiếu
        "max-glare": 0.5, // Độ sáng tối đa của ánh sáng phản chiếu
      });
    }

    // Cleanup hiệu ứng tilt khi component unmount
    return () => {
      if (tiltRef.current) {
        tiltRef.current.vanillaTilt?.destroy();
      }
    };
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-8">
      <div>
        {/* Áp dụng hiệu ứng tilt cho ảnh chính */}
        <div ref={tiltRef} className="relative aspect-square">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={`${product.title} - ${product.description}`}
              fill
              className="object-cover rounded-lg"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        {product.images && product.images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  mainImage === image ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <div className="flex items-center mt-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < product.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
              />
            ))}
          </div>
          <span className="ml-2 text-gray-600">
            ({product.reviews} {t("reviews")})
          </span>
        </div>
        <p className="text-2xl font-bold mt-4">${product.price}</p>
        <div className="flex items-center mt-4">
          <Input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-20"
          />
          <Button className="ml-4">
            <ShoppingCart className="mr-2 h-4 w-4" /> {t("addToCart")}
          </Button>
        </div>
        <div className="flex items-center mt-4 text-gray-600">
          <Truck className="h-5 w-5 mr-2" />
          <span>{t("freeShipping")}</span>
        </div>
      </div>
    </div>
  );
}
