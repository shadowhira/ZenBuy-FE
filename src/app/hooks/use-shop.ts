import { useMutation, useSuspenseQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import { shopService } from "@/services/shop.service"
import { useShopState } from "@/store/seller/shop/shop.state"
import { queryClient } from "@services/query-client"
import type { Shop, Product } from "src/types"
import type { ShopDetails } from "@/store/seller/shop/shop.types"

// Hook cho shop details với Hookstate
export function useShopDetails() {
  const shopState = useShopState()

  const query = useSuspenseQuery({
    queryKey: ["shop"],
    queryFn: shopService.getShopDetails,
    select: (data: ShopDetails) => {
      // Cập nhật state trong Hookstate
      shopState.details = {
        ...data,
        products: [] // Thêm products array rỗng để thỏa mãn type Shop
      }
      return data
    },
  })

  return query
}

// Hook cho update shop details
export function useUpdateShopDetails() {
  return useMutation({
    mutationFn: shopService.updateShopDetails,
    onSuccess: () => {
      // Invalidate shop query để fetch lại
      queryClient.invalidateQueries({ queryKey: ["shop"] })
    },
  })
}

// Hook cho danh sách shops
export function useShops() {
  return useQuery({
    queryKey: ["shops"],
    queryFn: () => shopService.getShopDetails(),
  })
}

// Hook cho shop theo ID
export function useShop(id: number) {
  return useQuery({
    queryKey: ["shop", id],
    queryFn: () => shopService.getShopDetails(),
  })
}

// Hook cho products của shop
export function useShopProducts(id: number, params?: {
  page?: number
  limit?: number
  sort?: string
}) {
  return useQuery({
    queryKey: ["shop-products", id, params],
    queryFn: () => shopService.getShopDetails(),
  })
}

// Hook cho tạo shop mới
export function useCreateShop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Omit<ShopDetails, "id">>) => shopService.updateShopDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] })
    },
  })
}

// Hook cho update shop
export function useUpdateShop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: number; data: Partial<Omit<ShopDetails, "id">> }) => 
      shopService.updateShopDetails(data.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["shops"] })
      queryClient.invalidateQueries({ queryKey: ["shop", id] })
    },
  })
}

// Hook cho xóa shop
export function useDeleteShop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => shopService.updateShopDetails({}),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["shops"] })
      queryClient.invalidateQueries({ queryKey: ["shop", id] })
    },
  })
}

