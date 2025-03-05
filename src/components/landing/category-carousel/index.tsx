"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCategories } from "../../../apis"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import styles from "@/styles/home.module.scss"
import { cn } from "@/lib/utils"

type Category = {
  id: number
  name: string
  image: string
}

export default function CategoryCarousel() {
  const { t } = useTranslation("landing");
  const [startIndex, setStartIndex] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories()
      setCategories(categories)
    }

    fetchCategories()
  }, [])

  const nextSlide = useCallback(() => {
    setStartIndex((prevIndex) => (prevIndex + 1) % categories.length)
  }, [categories.length])

  const prevSlide = useCallback(() => {
    setStartIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length)
  }, [categories.length])

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [nextSlide])

  const getVisibleCategories = () => {
    const endIndex = startIndex + 6
    if (endIndex <= categories.length) {
      return categories.slice(startIndex, endIndex)
    } else {
      return [...categories.slice(startIndex), ...categories.slice(0, endIndex - categories.length)]
    }
  }

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">{t('productCategoryLabel')}</h2>
        <div className="relative flex flex-col">
          <div className="flex overflow-hidden">
            {getVisibleCategories().map((category, index) => (
              <div key={index} className="flex-shrink-0 w-1/6 px-2">
                <div className={cn("bg-secondary rounded-lg p-4 text-center", styles.categoryCard)}>
                  <Image src={category.image} alt={category.name} className="mb-2 w-full h-full rounded-lg" width={300} height={300} />
                  <div className="font-medium">{category.name}</div>
                </div>
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
    </section>
  )
}
