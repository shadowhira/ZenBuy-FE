"use client"

import { useState } from "react"
import { Bell, Moon, Sun, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const categories = [
  { name: "Hats", subcategories: ["Baseball Caps", "Beanies", "Fedoras"] },
  { name: "Pants", subcategories: ["Jeans", "Chinos", "Shorts"] },
  { name: "Shirts", subcategories: ["T-Shirts", "Polo Shirts", "Dress Shirts"] },
]

export default function Navbar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary mr-8">Zen Buy</span>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary z-10">
                <span>Products</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 ease-in-out bg-background border rounded-md shadow-lg">
                {categories.map((category) => (
                  <div key={category.name} className="relative group/sub px-4 py-2 hover:bg-accent">
                    <span>{category.name}</span>
                    <div className="absolute left-full top-0 mt-0 w-48 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition duration-300 ease-in-out bg-background border rounded-md shadow-lg">
                      {category.subcategories.map((subcategory) => (
                        <a
                          key={subcategory}
                          href="#"
                          className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent"
                        >
                          {subcategory}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Tiếng Việt</DropdownMenuItem>
                <DropdownMenuItem>日本語</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}

