"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Slider } from "@/src/components/ui/slider"
import { Checkbox } from "@/src/components/ui/checkbox"
import ProductCard from "@/src/components/search/product-card"
import { ChevronDown, ChevronUp } from "lucide-react"

const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"]
const brands = ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"]

export default function SearchResults() {
  const [showFilters, setShowFilters] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 1000])

  // Mock product data
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    // price: Math.floor(Math.random() * 500) + 50,
    image: `/product${(i % 8) + 1}.jpg`,
    price: 500,
    rating: 4,
    // rating: Math.floor(Math.random() * 5) + 1,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
          {showFilters ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" /> Hide Filters
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" /> Show Filters
            </>
          )}
        </Button>
        <Button variant="ghost">Clear Filters</Button>
        <p className="text-muted-foreground">Showing 12 of 100 results</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {showFilters && (
          <div className="w-full md:w-1/4 space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Categories</h3>
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={category} />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Price Range</h3>
              <Slider min={0} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} className="mb-2" />
              <div className="flex justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Brands</h3>
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox id={brand} />
                  <label
                    htmlFor={brand}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>

            {/* Add more filter options here */}
          </div>
        )}

        <div className={`w-full ${showFilters ? "md:w-3/4" : "md:w-full"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="mx-1">
              Previous
            </Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button key={page} variant={page === 1 ? "default" : "outline"} className="mx-1">
                {page}
              </Button>
            ))}
            <Button variant="outline" className="mx-1">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

