'use client'

import { Button } from "@components/ui/button"
import Image from "next/image"
import { redirect } from "next/navigation"

const orders = [
  {
    id: 1,
    shop: "Tech Store",
    status: "Shipping",
    products: [{ id: 1, name: "Smartphone", image: "https://th.bing.com/th/id/OIP.7Pmzy4WNwMXk27HnmaPhYwHaDt?w=329&h=175&c=7&r=0&o=5&dpr=2&pid=1.7", variant: "Black", quantity: 1, price: 599.99 }],
  },
  {
    id: 2,
    shop: "Fashion Outlet",
    status: "Completed",
    products: [
      { id: 2, name: "T-Shirt", image: "https://th.bing.com/th/id/OIP.2JgARAJfGc7Mq_H8pE4WtgHaEM?w=311&h=180&c=7&r=0&o=5&dpr=2&pid=1.7", variant: "Large", quantity: 2, price: 29.99 },
      { id: 3, name: "Jeans", image: "https://th.bing.com/th/id/OIP.H3Er7U2zb1xHUW7kwliTMwHaHa?w=171&h=180&c=7&r=0&o=5&dpr=2&pid=1.7", variant: "32x32", quantity: 1, price: 59.99 },
    ],
  },
]

export default function OrderList() {
  const onGoShop = () => {
    redirect('/shop/1')
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{order.shop}</h3>
            <div className="space-x-2">
              <Button variant="outline">Message Shop</Button>
              <Button onClick={onGoShop} variant="outline">View Shop</Button>
            </div>
          </div>
          <p className="mb-4">
            Status: <span className="font-semibold">{order.status}</span>
          </p>
          {order.products.map((product) => (
            <div key={product.id} className="flex items-center justify-start gap-[50px] space-x-4 mb-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-md flex-shrink-0 w-[50%] border-primary max-h-[300px]"
              />
              <div>
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-gray-500">Variant: {product.variant}</p>
                <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                <p className="font-semibold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Mark as Received</Button>
            <Button variant="outline">Contact Seller</Button>
          </div>
        </div>
      ))}
    </div>
  )
}

