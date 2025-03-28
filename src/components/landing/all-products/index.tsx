"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getProducts } from "@apis/products"
import { useTranslation } from "react-i18next"
import styles from "@styles/home.module.scss"
import { cn } from "@lib/utils"
import type { Product } from "../../../types"

export default function AllProducts() {
  const { t } = useTranslation("landing");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const productsPerPage = 12

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({
          page: currentPage,
          limit: productsPerPage
        });
        setAllProducts(response.products);
        setTotalPages(Math.ceil(response.total / productsPerPage));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
  
    fetchProducts();
  }, [currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const onClick = (id: number) => {
    redirect(`/product/${id}`)
  }

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">{t('allProduct')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <Card key={product.id} className={cn("flex flex-col h-full cursor-pointer", styles.productCard)} onClick={() => onClick(product.id)}>
              <CardHeader className="p-0">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={`${product.title} - ${product.description}`}
                  className="w-full h-full object-cover rounded-t-lg"
                  layout="responsive"
                  width={300}
                  height={200}
                />
              </CardHeader>
              <CardContent className="flex flex-col gap-2 mt-5 flex-grow">
                <CardTitle>{product.title}</CardTitle>
                <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                <p className="text-muted-foreground">{product.category.name}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full">{t('addToCart')}</Button>
              </CardFooter>
            </Card>
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
    </section>
  )
}
