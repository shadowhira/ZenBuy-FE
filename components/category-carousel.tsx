"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  { name: "Shoes", icon: "👟" },
  { name: "Pants", icon: "👖" },
  { name: "Shirts", icon: "👕" },
  { name: "Hats", icon: "🧢" },
  { name: "Glasses", icon: "👓" },
  { name: "Watches", icon: "⌚" },
  { name: "Bags", icon: "👜" },
  { name: "Accessories", icon: "🧣" },
]

export default function CategoryCarousel() {
  const [startIndex, setStartIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setStartIndex((prevIndex) => (prevIndex + 1) % categories.length)
  }, [])

  const prevSlide = useCallback(() => {
    setStartIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">Product Categories</h2>
        <div className="relative">
          <div className="flex overflow-hidden">
            {categories.slice(startIndex, startIndex + 6).map((category, index) => (
              <div key={index} className="flex-shrink-0 w-1/6 px-2">
                <div className="bg-secondary rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
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

