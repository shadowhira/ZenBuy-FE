import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { cartService } from "@services/cart.service"
import { useCartState } from "@store/cart/cart.state"
import { queryClient } from "@services/query-client"

export function useCart() {
  const cartState = useCartState()

  const query = useSuspenseQuery({
    queryKey: ["cart"],
    queryFn: () => {
      // console.log('useCart - Fetching cart');
      return cartService.getCart();
    },
    select: (data) => {
      // console.log('useCart - Cart data received:', data);
      // Cập nhật state trong Hookstate
      cartState.items = data.items
      return data
    },
  })

  return query
}

export function useAddToCart() {
  return useMutation({
    mutationFn: (data) => {
      // console.log('useAddToCart - Adding item to cart:', data);
      return cartService.addToCart(data);
    },
    onSuccess: () => {
      // console.log('useAddToCart - Item added successfully');
      // Invalidate cart query để fetch lại
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
    onError: (error) => {
      // console.error('useAddToCart - Error adding item to cart:', error);
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

