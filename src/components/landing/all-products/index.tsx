"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@components/ui/card"
import { Button } from "@components/ui/button"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getProducts } from "src/apis"
import { useTranslation } from "react-i18next"
import styles from "@styles/home.module.scss"
import { cn } from "@lib/utils"

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

export default function AllProducts() {
  const { t } = useTranslation("landing");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setAllProducts(products);
    };
  
    fetchProducts();
  }, []);
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12
  const totalPages = Math.ceil(allProducts.length / productsPerPage)

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

   const onClick = (id: number) => {
    redirect(`/product/${id}`)
  }

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">{t('allProduct')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <Card key={product.id} className={cn("flex flex-col h-full cursor-pointer", styles.productCard)} onClick={() => onClick(product.id)}>
              <CardHeader className="p-0">
                <Image
                  src={product.images[0] || ""}
                  alt={product.title}
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
