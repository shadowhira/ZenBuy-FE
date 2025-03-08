import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { ordersService } from "@/services/orders.service"
import { useOrdersState } from "@/store"
import { queryClient } from "@app/services/query-client"

export function useOrders(page = 1, limit = 10) {
  const ordersState = useOrdersState()

  const query = useSuspenseQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => ordersService.getOrders(page, limit),
    select: (data) => {
      // Cập nhật state trong Hookstate
      ordersState.orders = data.orders
      return data
    },
  })

  return query
}

export function useOrderById(id: string) {
  const ordersState = useOrdersState()

  const query = useSuspenseQuery({
    queryKey: ["orders", id],
    queryFn: () => ordersService.getOrderById(id),
    select: (data) => {
      // Cập nhật state trong Hookstate
      ordersState.currentOrder = data
      return data
    },
  })

  return query
}

export function useCreateOrder() {
  const ordersState = useOrdersState()

  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: (data) => {
      // Cập nhật state trong Hookstate
      ordersState.currentOrder = data

      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })
}

export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => ordersService.updateOrderStatus(id, status as any),
    onSuccess: (data) => {
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["orders", data.id] })
    },
  })
}

