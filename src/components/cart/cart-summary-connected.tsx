"use client"

import { useState } from "react"
import { Button } from "@components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog"
import { Input } from "@components/ui/input"
import { useCart } from "@hooks/use-cart"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

// Mock vouchers - in a real app, these would come from an API
const vouchers = [
  { id: 1, code: "SUMMER10", discount: 10, type: "percentage" },
  { id: 2, code: "FREESHIP", discount: 5, type: "fixed" },
  { id: 3, code: "SAVE20", discount: 20, type: "percentage", minOrder: 100 },
]

export default function CartSummaryConnected() {
  const { t } = useTranslation("cart");
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const [selectedVoucher, setSelectedVoucher] = useState<typeof vouchers[0] | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherError, setVoucherError] = useState("");

  // Calculate subtotal
  const subtotal = cart?.items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  
  // Fixed shipping cost - in a real app, this might be calculated based on location, weight, etc.
  const shippingCost = subtotal > 0 ? 5 : 0;
  
  // Calculate discount
  let discount = 0;
  if (selectedVoucher) {
    if (selectedVoucher.type === "percentage") {
      if (!selectedVoucher.minOrder || subtotal >= selectedVoucher.minOrder) {
        discount = (subtotal * selectedVoucher.discount) / 100;
      }
    } else {
      discount = selectedVoucher.discount;
    }
  }
  
  // Calculate total
  const total = subtotal + shippingCost - discount;

  const applyVoucherCode = () => {
    const voucher = vouchers.find(v => v.code === voucherCode);
    if (!voucher) {
      setVoucherError(t("invalidVoucher") || "Invalid voucher code");
      return;
    }
    
    if (voucher.minOrder && subtotal < voucher.minOrder) {
      setVoucherError(t("voucherMinOrderError", { amount: voucher.minOrder }) || 
        `This voucher requires a minimum order of $${voucher.minOrder}`);
      return;
    }
    
    setSelectedVoucher(voucher);
    setVoucherError("");
    toast.success(t("voucherApplied") || "Voucher applied successfully");
  };

  const handleCheckout = () => {
    if (!cart?.items?.length) {
      toast.error(t("emptyCartError") || "Your cart is empty");
      return;
    }
    
    // Navigate to checkout page
    router.push("/checkout");
  };

  return (
    <div className="border p-6 rounded-lg sticky top-4">
      <h2 className="text-xl font-semibold mb-4">{t("orderSummary") || "Order Summary"}</h2>
      
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded"></div>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>{t("subtotal") || "Subtotal"}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("shipping") || "Shipping"}</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{t("discount") || "Discount"}</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2"></div>
          <div className="flex justify-between font-semibold">
            <span>{t("total") || "Total"}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}
      
      <div className="space-y-4 mb-4">
        <div className="flex space-x-2">
          <Input 
            placeholder={t("enterVoucherCode") || "Enter voucher code"} 
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
          />
          <Button variant="outline" onClick={applyVoucherCode}>
            {t("apply") || "Apply"}
          </Button>
        </div>
        
        {voucherError && (
          <p className="text-destructive text-sm">{voucherError}</p>
        )}
        
        {selectedVoucher && (
          <div className="bg-muted p-2 rounded flex justify-between items-center">
            <div>
              <span className="font-medium">{selectedVoucher.code}</span>
              <p className="text-sm text-muted-foreground">
                {selectedVoucher.type === "percentage" 
                  ? `${selectedVoucher.discount}% off` 
                  : `$${selectedVoucher.discount} off`}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedVoucher(null)}
            >
              {t("remove") || "Remove"}
            </Button>
          </div>
        )}
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mb-4">
            {t("availableVouchers") || "Available Vouchers"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("availableVouchers") || "Available Vouchers"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {vouchers.map((voucher) => (
              <Button
                key={voucher.id}
                variant="outline"
                className="w-full justify-between"
                onClick={() => {
                  if (voucher.minOrder && subtotal < voucher.minOrder) {
                    toast.error(t("voucherMinOrderError", { amount: voucher.minOrder }) || 
                      `This voucher requires a minimum order of $${voucher.minOrder}`);
                    return;
                  }
                  setSelectedVoucher(voucher);
                  toast.success(t("voucherApplied") || "Voucher applied successfully");
                }}
              >
                <span>{voucher.code}</span>
                <span>
                  {voucher.type === "percentage" 
                    ? `${voucher.discount}% off` 
                    : `$${voucher.discount} off`}
                  {voucher.minOrder && ` (min $${voucher.minOrder})`}
                </span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <Button 
        className="w-full" 
        onClick={handleCheckout}
        disabled={isLoading || !cart?.items?.length}
      >
        {t("proceedToCheckout") || "Proceed to Checkout"}
      </Button>
    </div>
  )
}
