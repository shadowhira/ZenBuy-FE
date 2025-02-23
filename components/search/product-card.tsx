import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    rating: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${index < product.rating ? "text-yellow-400" : "text-gray-300"}`}
              fill={index < product.rating ? "currentColor" : "none"}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}

