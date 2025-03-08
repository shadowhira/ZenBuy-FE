import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { shopService } from "@/services/shop.service"
import { useShopState } from "@/store"
import { queryClient } from "@/services/query-client"

export function useShopDetails() {
  const shopState = useShopState()

  const query = useSuspenseQuery({
    queryKey: ["shop"],
    queryFn: shopService.getShopDetails,
    select: (data) => {
      // Cập nhật state trong Hookstate
      shopState.details = data
      return data
    },
  })

  return query
}

export function useUpdateShopDetails() {
  return useMutation({
    mutationFn: shopService.updateShopDetails,
    onSuccess: () => {
      // Invalidate shop query để fetch lại
      queryClient.invalidateQueries({ queryKey: ["shop"] })
    },
  })
}

