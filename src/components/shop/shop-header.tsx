import { Button } from "@/src/components/ui/button"
import { Star } from "lucide-react"

interface ShopHeaderProps {
  shop: {
    name: string
    description: string
    banner: string
    avatar: string
    followers: number
    rating: number
  }
}

export default function ShopHeader({ shop }: ShopHeaderProps) {
  return (
    <div className="relative">
      <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${shop.banner})` }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <img
              className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
              src={shop.avatar || "/placeholder.svg"}
              alt={shop.name}
            />
          </div>
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{shop.name}</h1>
              <p className="text-sm text-gray-500">{shop.description}</p>
            </div>
            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button>Follow</Button>
              <Button variant="outline">Message</Button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            <span className="font-medium">{shop.rating}</span>
          </div>
          <div>
            <span className="font-medium">{shop.followers}</span>
            <span className="text-gray-500"> followers</span>
          </div>
        </div>
      </div>
    </div>
  )
}

