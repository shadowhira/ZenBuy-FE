import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { cartService } from "@services/cart.service"
import { useCartState } from "@store/cart/cart.state"
import { queryClient } from "@services/query-client"

export function useCart() {
  const cartState = useCartState()

  const query = useSuspenseQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    select: (data) => {
      // Cập nhật state trong Hookstate
      cartState.items = data.items
      return data
    },
  })

  return query
}

export function useAddToCart() {
  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      // Invalidate cart query để fetch lại
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: { quantity: number } }) =>
      cartService.updateCartItem(itemId, data),
    onSuccess: () => {
      // Invalidate cart query để fetch lại
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

export function useRemoveCartItem() {
  return useMutation({
    mutationFn: cartService.removeCartItem,
    onSuccess: () => {
      // Invalidate cart query để fetch lại
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

export function useClearCart() {
  return useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      // Invalidate cart query để fetch lại
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

