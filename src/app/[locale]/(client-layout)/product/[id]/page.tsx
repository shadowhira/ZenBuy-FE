'use client';

import Breadcrumb from "@components/product/breadcrumb"
import ProductDetails from "@components/product/product-details"
import ShopInfo from "@components/product/shop-info"
import ProductDescription from "@components/product/product-description"
import ProductReviews from "@components/product/product-reviews"
import ShopProducts from "@components/product/shop-products"
import SimilarProducts from "@components/product/similar-products"
import { useEffect, useState } from "react"
import React from "react";
import { getProductById } from "@apis/products"
import type { Product } from "@/types"
import { useTranslation } from "react-i18next"

interface Params {
  id: string;
}

export default function Page({ params }: { params: Promise<Params> }) {
  const { t } = useTranslation("detail-product")
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Giải bọc params
  const unwrappedParams = React.use(params)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // Lấy số từ chuỗi "product-5"
        const id = parseInt(unwrappedParams.id.split('-')[1])
        if (isNaN(id)) {
          throw new Error('Invalid product ID')
        }
        const data = await getProductById(id)
        setProduct(data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        setError(error instanceof Error ? error.message : 'Không thể tải thông tin sản phẩm')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [unwrappedParams.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{t('error')}</h2>
          <p className="text-gray-600">{error || t('productNotFound')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        category={product.category}
        subcategory={product.category.name}
        productName={product.title}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProductDetails product={product} />
          <ProductDescription description={product.description} />
          <ProductReviews productId={product.id} />
        </div>
        <div>
          <ShopInfo shop={product.shop} />
          <ShopProducts shopName={product.shop.name} />
        </div>
      </div>
      <div className="mt-8">
        <SimilarProducts category={product.category} />
      </div>
    </div>
  )
}