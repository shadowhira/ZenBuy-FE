"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/search/product-card"
import { getProducts } from "@/apis"

interface SimilarProductsProps {
  category: Category
}

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
}

export default function SimilarProducts({ category }: SimilarProductsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts()
      products.sort((a, b) => a.price - b.price)
      setSimilarProducts(products)
    }

    fetchProducts()
  }, [])

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = similarProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(similarProducts.length / productsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            variant={currentPage === i + 1 ? "default" : "outline"}
            className="mx-1"
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}

