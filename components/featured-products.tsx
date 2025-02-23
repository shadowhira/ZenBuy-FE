"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const featuredProducts = [
  { id: 1, name: "Premium Sneakers", price: "$129.99", image: "/product1.jpg" },
  { id: 2, name: "Stylish Sunglasses", price: "$79.99", image: "/product2.jpg" },
  { id: 3, name: "Leather Watch", price: "$199.99", image: "/product3.jpg" },
  { id: 4, name: "Denim Jacket", price: "$89.99", image: "/product4.jpg" },
  { id: 5, name: "Wireless Earbuds", price: "$149.99", image: "/product5.jpg" },
  { id: 6, name: "Slim Fit Jeans", price: "$69.99", image: "/product6.jpg" },
  { id: 7, name: "Smart Watch", price: "$249.99", image: "/product7.jpg" },
  { id: 8, name: "Running Shoes", price: "$109.99", image: "/product8.jpg" },
]

export default function FeaturedProducts() {
  const [page, setPage] = useState(0)
  const productsPerPage = 4

  const nextPage = () => {
    setPage((prevPage) => (prevPage + 1) % Math.ceil(featuredProducts.length / productsPerPage))
  }

  const prevPage = () => {
    setPage(
      (prevPage) =>
        (prevPage - 1 + Math.ceil(featuredProducts.length / productsPerPage)) %
        Math.ceil(featuredProducts.length / productsPerPage),
    )
  }

  const displayedProducts = featuredProducts.slice(page * productsPerPage, (page + 1) * productsPerPage)

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="relative">
          <div className="flex space-x-4">
            {displayedProducts.map((product) => (
              <Card key={product.id} className="w-64">
                <CardHeader>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle>{product.name}</CardTitle>
                  <p className="text-muted-foreground">{product.price}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2"
            onClick={prevPage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
            onClick={nextPage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  )
}

