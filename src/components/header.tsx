import { ShoppingCart, Search } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"

export default function Header() {
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
            <Button variant="outline">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

