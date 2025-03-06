"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import ProductCard from "@/components/search/product-card"
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTranslation } from "react-i18next"
import seedrandom from 'seedrandom';

const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"]
const brands = ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"]

export default function SearchResults() {
  const { t } = useTranslation("searchPage");
  const [showFilters, setShowFilters] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  
  // Mock product data
  const rng = seedrandom('my-fixed-seed'); // Sử dụng seed cố định
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    price: Math.floor(rng() * 500) + 50, // Sử dụng rng() thay vì Math.random()
    description: "Product description goes here",
    category: { id: 1, name: categories[i % categories.length], image: "" },
    images: [`https://picsum.photos/seed/${i}/200`],
    rating: Math.floor(rng() * 5) + 1, // Sử dụng rng() thay vì Math.random()
  }));

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 1000])
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{t("filters")}</h3>
        {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
            <X className="h-4 w-4 mr-1" /> {t("clearAll")}
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "brands"]} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>{t("categories")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label htmlFor={`category-${category}`} className="text-sm font-medium">
                    {t(category)}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>{t("priceRange")}</AccordionTrigger>
          <AccordionContent>
            <Slider min={0} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} className="mb-6 pt-5" />
            <div className="flex justify-between">
              <span className="text-sm font-medium">${priceRange[0]}</span>
              <span className="text-sm font-medium">${priceRange[1]}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger>{t("brands")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <label htmlFor={`brand-${brand}`} className="text-sm font-medium">
                    {t(brand)}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {t('filters')}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <FilterContent />
            </SheetContent>
          </Sheet>

          <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
          {showFilters ? (
            <><ChevronUp className="mr-2 h-4 w-4" /> {t("hideFilters")}</>
          ) : (
            <><ChevronDown className="mr-2 h-4 w-4" /> {t("showFilters")}</>
          )}
        </Button>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{t('showingResults', {start:1, end:12, total:60})}</span>
          </p>

          <Select defaultValue="featured">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t('featured')}</SelectItem>
              <SelectItem value="price-low">{t('priceLowToHigh')}</SelectItem>
              <SelectItem value="price-high">{t('priceHighToLow')}</SelectItem>
              <SelectItem value="newest">{t('newestFirst')}</SelectItem>
              <SelectItem value="rating">{t('highestRated')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {showFilters && (
          <div className="hidden md:block w-full md:w-1/4">
            <FilterContent />
          </div>
        )}

        <div className={`w-full ${showFilters ? "md:w-3/4" : "md:w-full"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                />
              </PaginationItem>

              {[1, 2, 3, 4, 5].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < 5) setCurrentPage(currentPage + 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

