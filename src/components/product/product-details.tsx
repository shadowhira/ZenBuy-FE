"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Truck, ShoppingCart } from "lucide-react"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"

interface ProductDetailsProps {
  product: {
    title: string
    price: number
    rating: number
    reviews: number
    images: string[]
  }
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [mainImage, setMainImage] = useState(product.images[0])
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-8">
      <div>
        <Image
          src={mainImage || "/placeholder.svg"}
          alt={product.title}
          width={500}
          height={500}
          className="w-full rounded-lg"
        />
        <div className="flex mt-4 space-x-2 overflow-x-auto">
          {product.images.map((img, index) => (
            <Image
              key={index}
              src={img || "/placeholder.svg"}
              alt={`${product.title} ${index + 1}`}
              width={100}
              height={100}
              className="rounded-md cursor-pointer"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <div className="flex items-center mt-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-5 w-5 ${index < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
              fill="currentColor"
            />
          ))}
          <span className="ml-2 text-sm text-gray-500">({product.reviews} reviews)</span>
        </div>
        <p className="text-2xl font-bold mt-4">${product.price.toFixed(2)}</p>
        <div className="flex items-center mt-4">
          <Truck className="h-5 w-5 mr-2" />
          <span>Free shipping</span>
        </div>
        <div className="mt-6">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <Input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            className="mt-1 w-20"
          />
        </div>
        <div className="mt-6 space-x-4">
          <Button size="lg">Buy Now</Button>
          <Button size="lg" variant="outline">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

