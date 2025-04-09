"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card"
import { Skeleton } from "@components/ui/skeleton"
import { productsService } from "@services/products.service"
import { Product } from "@/types"
import Link from "next/link"
import ProductForm from "@components/seller/product-form"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation("seller")
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productId = params.id
        const response = await productsService.getProductById(productId)
        setProduct(response)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError(t("errorLoadingProduct") || "Error loading product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, t])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/seller/products/list">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">{t("back") || "Back"}</span>
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">{t("error") || "Error"}</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t("errorLoadingProduct") || "Error Loading Product"}</CardTitle>
            <CardDescription>
              {error || t("productNotFound") || "Product not found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/seller/products/list">
              <Button>
                {t("backToProducts") || "Back to Products"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/seller/products/list">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t("back") || "Back"}</span>
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">
          {t("editProduct") || "Edit Product"}
        </h2>
      </div>
      
      <ProductForm initialData={product} />
    </div>
  )
}
