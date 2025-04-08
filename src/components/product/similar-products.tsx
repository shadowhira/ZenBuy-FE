"use client"

import { useEffect, useState } from "react"
import { Button } from "@components/ui/button"
import ProductCard from "@components/product/product-card"
import { productsService } from "@services/products.service"
import { useTranslation } from "react-i18next"
// Product type definition for legacy API
interface LegacyProduct {
  id: number;
  name?: string;
  title?: string;
  price: number;
  description?: string;
  category?: any;
  images?: string[];
  rating?: number;
  stock?: number;
  slug?: string;
  _id?: string;
}

interface SimilarProductsProps {
  category: Category
}

type Category = {
  _id?: string
  id?: number
  name: string
  image?: string
  slug?: string
}

export default function SimilarProducts({ category }: SimilarProductsProps) {
  const { t } = useTranslation("detail-product")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8
  const [similarProducts, setSimilarProducts] = useState<LegacyProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await productsService.getProducts({ category: category._id })
        if (response && response.products && isMounted) {
          // Convert Product[] to LegacyProduct[] to fix type error
          const sortedProducts = [...response.products].sort((a, b) => a.price - b.price)
          setSimilarProducts(sortedProducts as unknown as LegacyProduct[])
        }
      } catch (error) {
        // console.error('Failed to fetch similar products:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [category._id])

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = similarProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(similarProducts.length / productsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t("similarProducts")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{t("similarProducts")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard
            key={product._id || String(product.id)}
            product={{
              _id: product._id || String(product.id),
              title: product.title || product.name || 'Product',
              price: product.price,
              description: product.description || '',
              category: product.category ? {
                _id: product.category._id || product.category.id || '',
                name: product.category.name || '',
                slug: product.category.slug || ''
              } : undefined,
              images: product.images || [],
              rating: product.rating,
              stock: product.stock || 10,
              slug: product.slug || ''
            }}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => paginate(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

