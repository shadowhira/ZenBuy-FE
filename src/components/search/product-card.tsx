import { Card, CardContent, CardFooter, CardHeader } from "@components/ui/card"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { cn } from "@lib/utils"
import { useTranslation } from "react-i18next"

interface ProductCardProps {
  product: Product
}

type Category = {
  id: number
  name: string
  image: string
}

type Product = {
  id: number
  title: string
  price: number
  description: string
  category: Category
  images: string[]
  rating?: number
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation("searchPage")
  const imageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "https://th.bing.com/th?q=Sword+Cartoon+Vector&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=2&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247"

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={product.title || "Product image"}
            fill
            className="object-cover"
          />
          {product.category && (
            <Badge className="absolute top-2 left-2 bg-primary/80 hover:bg-primary">{product.category.name}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1 mb-2">
          {product.description || "No description available"}
        </p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
          {product.rating && (
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < product.rating! ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">
          {t("addToCart")}
        </Button>
      </CardFooter>
    </Card>
  )
}

