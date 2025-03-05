"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const vouchers = [
  { id: 1, code: "SUMMER10", discount: "10% off" },
  { id: 2, code: "FREESHIP", discount: "Free shipping" },
  { id: 3, code: "SAVE20", discount: "20% off on orders over $100" },
]

export default function CartSummary() {
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null)

  return (
    <div className="border-2 border-sky-800 p-6 rounded-lg sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>$89.97</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>$5.00</span>
        </div>
        {selectedVoucher && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-$8.99</span>
          </div>
        )}
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>$85.98</span>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mb-4">
            {selectedVoucher || "Apply Voucher"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Available Vouchers</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {vouchers.map((voucher) => (
              <Button
                key={voucher.id}
                variant="outline"
                className="w-full justify-between"
                onClick={() => setSelectedVoucher(voucher.code)}
              >
                <span>{voucher.code}</span>
                <span>{voucher.discount}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Button className="w-full">Proceed to Checkout</Button>
    </div>
  )
}

