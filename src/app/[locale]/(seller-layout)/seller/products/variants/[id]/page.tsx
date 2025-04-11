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
import ProductVariants from "@components/seller/product-variants"

interface ProductVariantsPageProps {
  params: {
    id: string
  }
}

export default function ProductVariantsPage({ params }: ProductVariantsPageProps) {
  const { t } = useTranslation("seller")
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await productsService.getProductById(params.id)
        setProduct(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="gap-1" disabled>
            <ArrowLeft className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </Button>
        </div>
        <Skeleton className="h-10 w-64 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            {t("back") || "Back"}
          </Button>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">{t("error") || "Error"}</CardTitle>
            <CardDescription className="text-red-600">
              {error || "Failed to load product"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>{t("back") || "Back"}</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          asChild
        >
          <Link href={`/seller/products/edit/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            {t("back") || "Back to Product"}
          </Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">
        {t("manageVariants") || "Manage Variants"}: {product.title}
      </h1>
      <ProductVariants productId={params.id} />
    </div>
  )
}
