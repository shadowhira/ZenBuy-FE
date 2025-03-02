"use client"

import { useEffect, useState } from "react"
import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import Image from "next/image"
import LanguageChanger from "../utils/languague-changer"
import ThemeChanger from "../utils/theme-changer"
import { getCategories } from "@/src/apis"
import Link from "next/link"
import { ShoppingCart, Search } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import logo from "@images/zenBuy.webp"
import { redirect } from "next/navigation"


type Category = {
  id: number
  name: string
  image: string
}

export default function Navbar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories()
      setCategories(categories)
    }

    fetchCategories()
  }, [])

  const onGoHome = () => {
    redirect('/')
  }

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 gap-[20px] sm:gap-[50px] md:gap-[100px] lg:gap-[300px] xl:gap-[400px]">
          <div className="flex items-center flex-grow">
            <div className="flex-shrink-0 cursor-pointer mr-5" onClick={() => onGoHome()}>
              <Image src={logo} alt="Zen Buy Logo" width={60} height={60} className="border-4 border-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full" />
            </div>
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
            <div className="flex-grow mx-4">
              <div className="relative">
                <Input type="search" placeholder="Search for products..." className="w-full pl-10" />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
        </div>
        <div className="flex items-center">
          <div className="flex-shrink-0">
              <DropdownMenu open={isCartOpen} onOpenChange={setIsCartOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    onMouseEnter={() => setIsCartOpen(true)}
                    onMouseLeave={() => setIsCartOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-80"
                  onMouseEnter={() => setIsCartOpen(true)}
                  onMouseLeave={() => setIsCartOpen(false)}
                >
                  {cartItems.map((item) => (
                    <DropdownMenuItem key={item.id}>
                    <div className="flex items-center space-x-4">
                      <Image
                      src={item.images[0]}
                      alt={item.title}
                      width={40}
                      height={40}
                      className="rounded-md"
                      />
                      <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        1 x ${item.price}
                      </p>
                      </div>
                    </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem>
                    <Link href="/cart" className="w-full">
                      <Button className="w-full">View Cart</Button>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
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

// Mock data for cart items
const cartItems = [
  {
    "id": 1,
    "title": "Majestic Mountain Graphic T-Shirt",
    "slug": "majestic-mountain-graphic-t-shirt",
    "price": 44,
    "description": "Elevate your wardrobe with this stylish black t-shirt featuring a striking monochrome mountain range graphic. Perfect for those who love the outdoors or want to add a touch of nature-inspired design to their look, this tee is crafted from soft, breathable fabric ensuring all-day comfort. Ideal for casual outings or as a unique gift, this t-shirt is a versatile addition to any collection.",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2025-02-23T07:52:28.000Z",
      "updatedAt": "2025-02-23T07:52:28.000Z"
    },
    "images": [
      "https://i.imgur.com/QkIa5tT.jpeg",
      "https://i.imgur.com/jb5Yu0h.jpeg",
      "https://i.imgur.com/UlxxXyG.jpeg"
    ],
    "creationAt": "2025-02-23T07:52:28.000Z",
    "updatedAt": "2025-02-23T07:52:28.000Z"
  },
  {
    "id": 4,
    "title": "Classic Grey Hooded Sweatshirt",
    "slug": "classic-grey-hooded-sweatshirt",
    "price": 90,
    "description": "Elevate your casual wear with our Classic Grey Hooded Sweatshirt. Made from a soft cotton blend, this hoodie features a front kangaroo pocket, an adjustable drawstring hood, and ribbed cuffs for a snug fit. Perfect for those chilly evenings or lazy weekends, it pairs effortlessly with your favorite jeans or joggers.",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2025-02-23T07:52:28.000Z",
      "updatedAt": "2025-02-23T07:52:28.000Z"
    },
    "images": [
      "https://i.imgur.com/R2PN9Wq.jpeg",
      "https://i.imgur.com/IvxMPFr.jpeg",
      "https://i.imgur.com/7eW9nXP.jpeg"
    ],
    "creationAt": "2025-02-23T07:52:28.000Z",
    "updatedAt": "2025-02-23T07:52:28.000Z"
  },
  {
    "id": 5,
    "title": "Classic Black Hooded Sweatshirt",
    "slug": "classic-black-hooded-sweatshirt",
    "price": 79,
    "description": "Elevate your casual wardrobe with our Classic Black Hooded Sweatshirt. Made from high-quality, soft fabric that ensures comfort and durability, this hoodie features a spacious kangaroo pocket and an adjustable drawstring hood. Its versatile design makes it perfect for a relaxed day at home or a casual outing.",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2025-02-23T07:52:28.000Z",
      "updatedAt": "2025-02-23T07:52:28.000Z"
    },
    "images": [
      "https://i.imgur.com/cSytoSD.jpeg",
      "https://i.imgur.com/WwKucXb.jpeg",
      "https://i.imgur.com/cE2Dxh9.jpeg"
    ],
    "creationAt": "2025-02-23T07:52:28.000Z",
    "updatedAt": "2025-02-23T07:52:28.000Z"
  },
]