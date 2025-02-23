"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import ProductCard from "@/src/components/search/product-card"

interface SimilarProductsProps {
  category: string
}

export default function SimilarProducts({ category }: SimilarProductsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8

  // Mock similar products
  const similarProducts = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `Similar Product ${i + 1}`,
    // price: Math.floor(Math.random() * 100) + 50,
    image: `/product${(i % 8) + 1}.jpg`,
    // rating: Math.floor(Math.random() * 5) + 1,
    price: 500,
    rating: 4,
  }))

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

