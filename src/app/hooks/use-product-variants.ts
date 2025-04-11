import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query"
import { productVariantsService } from "@services/product-variants.service"
import { toast } from "sonner"

// Hook to get all variants for a product
export function useProductVariants(productId: string) {
  return useSuspenseQuery({
    queryKey: ["productVariants", productId],
    queryFn: () => productVariantsService.getVariants(productId),
  })
}

// Hook to get a specific variant
export function useProductVariant(productId: string, variantId: string) {
  return useSuspenseQuery({
    queryKey: ["productVariants", productId, variantId],
    queryFn: () => productVariantsService.getVariant(productId, variantId),
  })
}

// Hook to create a variant
export function useCreateProductVariant(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      name: string
      price: number
      stock: number
      attributes: Record<string, string>
    }) => productVariantsService.createVariant(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productVariants", productId] })
      toast.success("Variant created successfully")
    },
    onError: (error) => {
      console.error("Error creating variant:", error)
      toast.error("Failed to create variant")
    },
  })
}

// Hook to update a variant
export function useUpdateProductVariant(productId: string, variantId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      name?: string
      price?: number
      stock?: number
      attributes?: Record<string, string>
    }) => productVariantsService.updateVariant(productId, variantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productVariants", productId] })
      queryClient.invalidateQueries({ queryKey: ["productVariants", productId, variantId] })
      toast.success("Variant updated successfully")
    },
    onError: (error) => {
      console.error("Error updating variant:", error)
      toast.error("Failed to update variant")
    },
  })
}

// Hook to delete a variant
export function useDeleteProductVariant(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variantId: string) => productVariantsService.deleteVariant(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productVariants", productId] })
      toast.success("Variant deleted successfully")
    },
    onError: (error) => {
      console.error("Error deleting variant:", error)
      toast.error("Failed to delete variant")
    },
  })
}
