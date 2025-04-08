"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@components/ui/button"
import { Checkbox } from "@components/ui/checkbox"
import { useCart, useUpdateCartItem, useRemoveCartItem } from "@hooks/use-cart"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

export default function CartItemsConnected() {
  const { t } = useTranslation("cart");
  const { data: cart, isLoading, error } = useCart();
  // console.log('CartItemsConnected - Cart data:', cart);
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // console.log('Updating cart item:', itemId, newQuantity);

    updateCartItem.mutate(
      {
        itemId, // itemId có thể là id hoặc _id
        data: { quantity: newQuantity }
      },
      {
        onSuccess: () => {
          toast.success(t("quantityUpdated") || "Quantity updated");
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : t("errorUpdatingQuantity") || "Error updating quantity");
        }
      }
    );
  };

  const handleRemoveItem = (itemId: string) => {
    // console.log('Removing cart item:', itemId);

    removeCartItem.mutate(itemId, { // itemId có thể là id hoặc _id
      onSuccess: () => {
        toast.success(t("itemRemoved") || "Item removed");
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : t("errorRemovingItem") || "Error removing item");
      }
    });
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const isAllSelected = cart?.items?.length ?
    cart.items.every(item => selectedItems[item.id]) :
    false;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems({});
    } else {
      const newSelected: Record<string, boolean> = {};
      cart?.items?.forEach(item => {
        newSelected[item.id] = true;
      });
      setSelectedItems(newSelected);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{t("loading") || "Loading..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>{t("errorLoadingCart") || "Error loading cart"}</p>
        <p className="text-sm mt-2">{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">{t("emptyCart") || "Your cart is empty"}</h3>
        <p className="text-muted-foreground mt-2">{t("emptyCartMessage") || "Add some products to your cart"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 pb-2 border-b">
        <Checkbox
          id="select-all"
          checked={isAllSelected}
          onCheckedChange={toggleSelectAll}
        />
        <label htmlFor="select-all" className="text-sm font-medium">
          {t("selectAll") || "Select All"}
        </label>
      </div>

      {cart.items.map((item) => {
        // Sử dụng _id hoặc id tùy thuộc vào dữ liệu
        const itemId = item._id || item.id;
        if (!itemId) {
          // console.warn('Cart item without ID:', item);
          return null;
        }

        return (
        <div key={itemId} className="flex items-center space-x-4 border-b pb-4">
          <Checkbox
            id={`select-${itemId}`}
            checked={!!selectedItems[itemId]}
            onCheckedChange={() => toggleSelectItem(itemId)}
          />
          <div className="relative h-20 w-20">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title || "Product"}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold">{item.title || "Product"}</h3>
            {item.variant && (
              <p className="text-sm text-muted-foreground">{item.variant}</p>
            )}
            <div className="flex items-center mt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(itemId, item.quantity - 1)}
                disabled={updateCartItem.isPending}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-2">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(itemId, item.quantity + 1)}
                disabled={updateCartItem.isPending || item.quantity >= (item.stock || 10)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveItem(itemId)}
              disabled={removeCartItem.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
      })}
    </div>
  )
}
