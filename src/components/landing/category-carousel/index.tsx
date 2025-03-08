"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@components/ui/button"
import { getCategories } from "../../../apis"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import styles from "@styles/home.module.scss"
import { cn } from "@lib/utils"

type Category = {
  id: number
  name: string
  image: string
}

export default function CategoryCarousel() {
  const { t } = useTranslation("landing")
  const [categories, setCategories] = useState<Category[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories()
      setCategories(categories)
    }

    fetchCategories()
  }, [])

  // Nhân đôi danh sách categories để tạo hiệu ứng vòng lặp
  const duplicatedCategories = [...categories, ...categories]

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === categories.length - 1) {
        // Reset currentIndex về 0 khi đạt cuối danh sách gốc
        return 0
      }
      return prevIndex + 1
    })
  }, [categories.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        // Quay lại cuối danh sách khi ở đầu
        return categories.length - 1
      }
      return prevIndex - 1
    })
  }, [categories.length])

  useEffect(() => {
    if (!isAutoPlayPaused) {
      const interval = setInterval(() => {
        nextSlide()
      }, 3000) // Change slide every 3 seconds

      return () => clearInterval(interval)
    }
  }, [nextSlide, isAutoPlayPaused])

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">{t('productCategoryLabel')}</h2>
        <div
          className="relative flex flex-col"
          onMouseEnter={() => setIsAutoPlayPaused(true)}
          onMouseLeave={() => setIsAutoPlayPaused(false)}
        >
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 6)}%)`,
              }}
            >
              {duplicatedCategories.map((category, index) => (
                <div key={index} className="flex-shrink-0 w-1/6 px-2">
                  <div
                    className={cn(
                      "bg-secondary rounded-lg p-4 text-center cursor-pointer",
                      styles.categoryCard
                    )}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      className="mb-2 w-full h-40 object-cover rounded-lg"
                      width={300}
                      height={300}
                    />
                    <div className="font-medium">{category.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  )
}