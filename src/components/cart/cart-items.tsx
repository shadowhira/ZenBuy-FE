"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for cart items
const cartItems = [
  {
    id: 1,
    name: "Product 1",
    image: "https://img.freepik.com/premium-psd/robot-sword-isolated-transparent-background-png_1053264-1.jpg?w=1380",
    price: 19.99,
    quantity: 1,
    variants: ["Small", "Medium", "Large"],
  },
  { id: 2, name: "Product 2", image: "https://th.bing.com/th/id/OIP.74Dgnpy6A4ZOnqcwB6iGrgAAAA?pid=ImgDet&w=168&h=350&c=7&dpr=2", price: 29.99, quantity: 2, variants: ["Red", "Blue", "Green"] },
  {
    id: 3,
    name: "Product 3",
    image: "https://th.bing.com/th/id/OIP.NlchQloXSuGbiIRG0ddlXgHaHa?pid=ImgDet&w=189&h=189&c=7&dpr=2",
    price: 39.99,
    quantity: 1,
    variants: ["Option A", "Option B", "Option C"],
  },
]

export default function CartItems() {
  const [items, setItems] = useState(cartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item)))
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
          <Checkbox id={`select-${item.id}`} />
          <Image src={item.image || "/placeholder.svg"} alt={item.name} width={80} height={80} className="rounded-md" />
          <div className="flex-grow">
            <h3 className="font-semibold">{item.name}</h3>
            <Select defaultValue={item.variants[0]}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {item.variants.map((variant) => (
                  <SelectItem key={variant} value={variant}>
                    {variant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center mt-2">
              <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-2">{item.quantity}</span>
              <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

