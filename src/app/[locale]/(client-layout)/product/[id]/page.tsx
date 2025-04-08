'use client';

// React and hooks
import { useEffect, useState } from "react"
import React from "react";
import { useTranslation } from "react-i18next"

// Services
import { productsService } from "@services/products.service"

// Types
import type { Product } from "@/types"

// Components
import Breadcrumb from "@components/product/breadcrumb"
import ProductDetails from "@components/product/product-details"
import ShopInfo from "@components/product/shop-info"
import ProductDescription from "@components/product/product-description"
import ProductReviews from "@components/product/product-reviews"
import ShopProducts from "@components/product/shop-products"
import SimilarProducts from "@components/product/similar-products"
import { Skeleton } from "@components/ui/skeleton"

interface Params {
  id: string;
}

export default function Page({ params }: { params: Promise<Params> }) {
  const { t } = useTranslation("detail-product")
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Unwrap params
  const unwrappedParams = React.use(params)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Use ID from unwrapped params
        const data = await productsService.getProductById(unwrappedParams.id)
        setProduct(data)
      } catch (error) {
        // console.error('Failed to fetch product:', error)
        setError(error instanceof Error ? error.message : 'Failed to load product information')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [unwrappedParams.id])

  // Show skeleton loader while loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-1/3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full mb-8" />
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-8" />
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-24 w-full mb-8" />
          </div>
          <div>
            <Skeleton className="h-[200px] w-full mb-8" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Show error message if there's an error or no product data
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{t('error') || 'Error'}</h2>
          <p className="text-gray-600">{error || t('productNotFound') || 'Product not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            {t('goBack') || 'Go Back'}
          </button>
        </div>
      </div>
    )
  }

  // Ensure all required properties exist with fallbacks
  const safeProduct = {
    ...product,
    title: product.title || 'Unnamed Product',
    description: product.description || '',
    category: product.category || { name: 'Uncategorized' },
    shop: product.shop || { name: 'Unknown Shop' }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        category={safeProduct.category}
        subcategory={safeProduct.category.name}
        productName={safeProduct.title}
      />
      {/* Product details section - full width on mobile, 2/3 width on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="lg:col-span-2">
          <ProductDetails product={safeProduct} />
        </div>
      </div>

      {/* Product description and reviews - full width */}
      <div className="mb-8">
        <ProductDescription description={safeProduct.description} />
      </div>

      <div className="mb-8">
        <ProductReviews productId={safeProduct._id || safeProduct.id || ''} />
      </div>

      {/* Shop info and products - full width */}
      <div className="mb-8">
        <ShopInfo shop={safeProduct.shop} />
      </div>

      <div className="mb-8">
        <ShopProducts shopName={safeProduct.shop.name} />
      </div>

      {/* Similar products - full width */}
      <div className="mb-8">
        <SimilarProducts category={safeProduct.category} />
      </div>
    </div>
  )
}