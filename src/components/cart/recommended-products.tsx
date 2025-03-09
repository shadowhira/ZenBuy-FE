"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@components/ui/button"
import ProductCard from "@components/search/product-card"

const recommendedProducts = [
  { id: 1, name: "Recommended Product 1", price: 29.99, image: "/product1.jpg", rating: 4 },
  { id: 2, name: "Recommended Product 2", price: 39.99, image: "/product2.jpg", rating: 5 },
  { id: 3, name: "Recommended Product 3", price: 19.99, image: "/product3.jpg", rating: 3 },
  { id: 4, name: "Recommended Product 4", price: 49.99, image: "/product4.jpg", rating: 4 },
  { id: 5, name: "Recommended Product 5", price: 59.99, image: "/product5.jpg", rating: 5 },
  { id: 6, name: "Recommended Product 6", price: 34.99, image: "/product6.jpg", rating: 4 },
]

export default function RecommendedProducts() {
  const [startIndex, setStartIndex] = useState(0)
  const productsToShow = 4

  const nextSlide = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % (recommendedProducts.length - productsToShow + 1))
  }

  const prevSlide = () => {
    setStartIndex(
      (prevIndex) =>
        (prevIndex - 1 + recommendedProducts.length - productsToShow + 1) %
        (recommendedProducts.length - productsToShow + 1),
    )
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
      <div className="relative">
        <div className="flex justify-center space-x-4 overflow-x-auto overflow-hidden p-10">
          {recommendedProducts.slice(startIndex, startIndex + productsToShow).map((product) => (
            <div key={product.id} className="w-64 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

