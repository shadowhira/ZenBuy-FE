import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
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
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
      <Image
        src={(Array.isArray(product.images) ? product.images[0] : product.images) || "https://down-vn.img.susercontent.com/file/34934060f7015e5452eddd67d9565e1d_tn"}
        alt={product.title || "hehe"}
        className="w-full h-48 object-cover rounded-lg"
        width={200}
        height={200}
      />
      </CardHeader>
      <CardContent>
      <h3 className="font-semibold">{product.title}</h3>
      <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
      <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}

