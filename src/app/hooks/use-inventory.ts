import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { inventoryService } from "@/services/inventory.service"
import { useInventoryState } from "@/store"
import { queryClient } from "@app/services/query-client"

export function useInventory(page = 1, limit = 20) {
  const inventoryState = useInventoryState()

  const query = useSuspenseQuery({
    queryKey: ["inventory", page, limit],
    queryFn: () => inventoryService.getInventory(page, limit),
    select: (data) => {
      // Cập nhật state trong Hookstate
      inventoryState.items = data.items
      return data
    },
  })

  return query
}

export function useInventoryItem(id: string) {
  const query = useSuspenseQuery({
    queryKey: ["inventory", id],
    queryFn: () => inventoryService.getInventoryItem(id),
  })

  return query
}

export function useCreateInventoryItem() {
  return useMutation({
    mutationFn: inventoryService.createInventoryItem,
    onSuccess: () => {
      // Invalidate inventory query để fetch lại
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
  })
}

export function useUpdateInventoryItem() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => inventoryService.updateInventoryItem(id, data),
    onSuccess: (data) => {
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
      queryClient.invalidateQueries({ queryKey: ["inventory", data.id] })
    },
  })
}

export function useDeleteInventoryItem() {
  return useMutation({
    mutationFn: inventoryService.deleteInventoryItem,
    onSuccess: () => {
      // Invalidate inventory query để fetch lại
      queryClient.invalidateQueries({ queryKey: ["inventory"] })
    },
  })
}

