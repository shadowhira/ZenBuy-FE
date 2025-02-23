'use client';

import Breadcrumb from "@/src/components/product/breadcrumb"
import ProductDetails from "@/src/components/product/product-details"
import ShopInfo from "@/src/components/product/shop-info"
import ProductDescription from "@/src/components/product/product-description"
import ProductReviews from "@/src/components/product/product-reviews"
import ShopProducts from "@/src/components/product/shop-products"
import SimilarProducts from "@/src/components/product/similar-products"
import { getProductById } from "@/src/apis"
import { useEffect, useState } from "react"
import React from "react";

type Category = {
  id: number
  name: string
  image: string
}

type Product = {
  id: number
  title: string
  price: number
  description: string
  category: Category
  images: string[]
  shop?: any
  subcategory: string
  rating: number
  reviews: number
}

interface Params {
  id: number;
}

export default function Page({ params }: { params: Promise<Params> }) {
  const [product, setProduct] = useState<Product>()
  const { id } = React.use(params);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProductById(id)
      setProduct({
        ...products,
        subcategory: "Subcategory",
        shop: {
          shopName: "Zenshop",
          shopAvatar: "https://down-vn.img.susercontent.com/file/34934060f7015e5452eddd67d9565e1d_tn"
        },
        rating: 4.5,
        reviews: 100,
      })
    }

    fetchProducts()
  }, [])
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {
        product && (
          <>
            <Breadcrumb category={product.category} subcategory={product.subcategory} productName={product.title} />
            <ProductDetails product={product} />
            <ShopInfo shop={product.shop} />
            <ProductDescription description={product.description} />
            <ProductReviews productId={product.id} />
            <ShopProducts shopName={product.shop.shopName} />
            <SimilarProducts category={product.category} />
          </>
        )
      }
    </div>
  )
}

