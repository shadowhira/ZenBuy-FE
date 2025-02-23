"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Search } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import logo from "@images/zenBuy.webp"
import { redirect } from "next/navigation"

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

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const onGoHome = () => {
    redirect('/')
  }

  return (
    <header className="bg-background py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onGoHome()}>
            <Image src={logo} alt="Zen Buy Logo" width={90} height={90} className="border-4 border-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full" />
            {/* <img className="h-8 w-auto" src="/logo.svg" alt="Zen Buy Logo" /> */}
          </div>
          <div className="flex-grow mx-4">
            <div className="relative">
              <Input type="search" placeholder="Search for products..." className="w-full pl-10" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
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
        </div>
      </div>
    </header>
  )
}

