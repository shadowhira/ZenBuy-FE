"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@components/ui/card"
import Image from "next/image"
import { redirect } from "next/navigation"
import { useTranslation } from "react-i18next"
import styles from "@styles/home.module.scss"
import { cn } from "@lib/utils"
import { getProducts } from "@apis/products"
import type { Product } from "../../../types"

export default function FeaturedProducts() {
  const { t } = useTranslation("landing");
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const productsPerPage = 4

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts()
        // Lọc các sản phẩm có rating cao nhất
        const sortedProducts = [...response.products].sort((a, b) => b.rating - a.rating)
        setFeaturedProducts(sortedProducts)
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      }
    }

    fetchProducts()
  }, [])

  const onClick = (id: number) => {
    redirect(`/product/${id}`)
  }

  const nextPage = () => {
    setPage((prevPage) => (prevPage + 1) % Math.ceil(featuredProducts.length / productsPerPage))
  }

  const prevPage = () => {
    setPage((prevPage) => (prevPage - 1 + Math.ceil(featuredProducts.length / productsPerPage)) % Math.ceil(featuredProducts.length / productsPerPage))
  }

  const displayedProducts = featuredProducts.slice(page * productsPerPage, (page + 1) * productsPerPage)

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">{t('featureProductLabel')}</h2>
        <div className="relative">
          <div className="flex space-x-4 justify-between h-[400px]">
            {displayedProducts.map((product) => (
              <Card key={product.id} className={cn("flex-grow flex flex-col cursor-pointer", styles.productCard)} onClick={() => onClick(product.id)}>
                <CardHeader>
                  <Image
                    src={product.images[0] || ""}
                    alt={product.title}
                    className="w-full max-h-[150px] object-cover rounded-lg"
                    width={200}
                    height={200}
                  />
                </CardHeader>
                <CardContent className="flex flex-grow">
                  <CardTitle>{product.title}</CardTitle>
                  <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">{t('addToCart')}</Button>
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
