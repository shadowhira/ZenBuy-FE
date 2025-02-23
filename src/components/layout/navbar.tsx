"use client"

import { useEffect, useState } from "react"
import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import Image from "next/image"
import LanguageChanger from "../utils/languague-changer"
import ThemeChanger from "../utils/theme-changer"
import { getCategories } from "@/src/apis"

type Category = {
  id: number
  name: string
  image: string
}

export default function Navbar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories()
      setCategories(categories)
    }

    fetchCategories()
  }, [])

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary mr-8">Zen Buy</span>
            <div 
              className="relative group z-20 w-auto" 
              onMouseEnter={() => setOpenCategory('products')} 
              onMouseLeave={() => setOpenCategory(null)}
            >
              <button className="bg-none flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary">
              <span>Products</span>
              <ChevronDown className="h-4 w-4" />
              </button>
              <div className={`absolute left-0 mt-2 w-56 transition duration-300 ease-in-out bg-background border rounded-md shadow-lg ${openCategory === 'products' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              {categories.map((category) => (
                <div key={category.id} className="flex flex-row gap-2 width-full z-50 relative group/sub px-4 py-2 hover:bg-accent">
                <Image src={category.image} alt={category.name} className="w-8 h-8 rounded-sm" width={8} height={8} />
                <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeChanger />
          <LanguageChanger />
        </div>
      </div>
    </div>
  </nav>
)}
