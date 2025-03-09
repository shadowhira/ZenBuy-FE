"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@components/ui/button"
import ProductCard from "@components/search/product-card"

interface ShopProductsProps {
  shopName: string
}

export default function ShopProducts({ shopName }: ShopProductsProps) {
  const [page, setPage] = useState(0)
  const productsPerPage = 4

  // Mock shop products
  const shopProducts = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `${shopName} Product ${i + 1}`,
    // price: Math.floor(Math.random() * 100) + 50,
    image: `/product${(i % 8) + 1}.jpg`,
    // rating: Math.floor(Math.random() * 5) + 1,
    price: 500,
    rating: 4,
  }))

  const displayedProducts = shopProducts.slice(page * productsPerPage, (page + 1) * productsPerPage)

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">More from this shop</h2>
      <div className="relative px-[15px]">
        <div className="flex space-x-4 overflow-x-auto overflow-hidden p-10">
          {displayedProducts.map((product) => (
            <div key={product.id} className="w-64 flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
          onClick={() => setPage((prev) => Math.max(0, prev - 1))}
          disabled={page === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
          onClick={() => setPage((prev) => Math.min(Math.ceil(shopProducts.length / productsPerPage) - 1, prev + 1))}
          disabled={page === Math.ceil(shopProducts.length / productsPerPage) - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

