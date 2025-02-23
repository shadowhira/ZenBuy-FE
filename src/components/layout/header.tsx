"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Search } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"

// Mock data for cart items
const cartItems = [
  { id: 1, name: "Product 1", image: "/product1.jpg", price: 19.99, quantity: 1 },
  { id: 2, name: "Product 2", image: "/product2.jpg", price: 29.99, quantity: 2 },
]

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <header className="bg-background py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <img className="h-8 w-auto" src="/logo.svg" alt="Zen Buy Logo" />
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
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ${item.price}
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

