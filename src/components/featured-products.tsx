"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { getProducts } from "../apis"
import Image from "next/image"

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

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const productsPerPage = 4

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts()
      products.sort((a, b) => a.price - b.price)
      setFeaturedProducts(products)
    }

    fetchProducts()
  }, [])

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
          <div className="flex space-x-4 justify-between">
            {displayedProducts.map((product) => (
              <Card key={product.id} className="flex-grow flex flex-col">
                <CardHeader>
                  <Image
                    src={product.images[0] || ""}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-lg"
                    width={200}
                    height={100}
                  />
                </CardHeader>
                <CardContent className="flex flex-grow">
                  <CardTitle>{product.title}</CardTitle>
                  <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
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
