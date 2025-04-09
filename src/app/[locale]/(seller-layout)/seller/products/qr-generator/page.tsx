"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ArrowLeft } from "lucide-react"
import { Button } from "@components/ui/button"
import Link from "next/link"
import ProductQRGenerator from "@components/bar-code/generator-product"

export default function ProductQRGeneratorPage() {
  const { t } = useTranslation()

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
          {t("productQRGenerator") || "Product QR Generator"}
        </h2>
      </div>
      
      <div className="mt-6">
        <ProductQRGenerator />
      </div>
    </div>
  )
}
