import { useSuspenseQuery, useInfiniteQuery } from "@tanstack/react-query"
import { productsService } from "@services/products.service"
import { useProductsState } from "@store/products/products.state"
import { queryClient } from "@services/query-client"

export interface ProductSearchParams {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  sort?: string
}

export function useProducts(params: ProductSearchParams = {}) {
  const productsState = useProductsState()

  const query = useSuspenseQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.getProducts(params),
    select: (data) => {
      // Cập nhật state trong Hookstate
      productsState.products = data.products
      return data
    },
  })

  return query
}

export function useInfiniteProducts(params: ProductSearchParams = {}) {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", params],
    queryFn: ({ pageParam = 1 }) => productsService.getProducts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page * lastPage.limit < lastPage.total
      return hasMore ? lastPage.page + 1 : undefined
    },
  })
}

export function useProductById(id: string) {
  const productsState = useProductsState()

  const query = useSuspenseQuery({
    queryKey: ["products", id],
    queryFn: () => productsService.getProductById(id),
    select: (data) => {
      // Cập nhật state trong Hookstate
      productsState.currentProduct = data
      return data
    },
  })

  return query
}

export function useFeaturedProducts() {
  const productsState = useProductsState()

  const query = useSuspenseQuery({
    queryKey: ["products", "featured"],
    queryFn: productsService.getFeaturedProducts,
    select: (data) => {
      // Cập nhật state trong Hookstate
      productsState.featuredProducts = data
      return data
    },
  })

  return query
}

export function useSearchProducts(query: string) {
  const productsState = useProductsState()

  const queryResult = useSuspenseQuery({
    queryKey: ["products", "search", query],
    queryFn: () => productsService.searchProducts(query),
    select: (data) => {
      // Cập nhật state trong Hookstate
      productsState.products = data.products
      return data
    },
  })

  return queryResult
}

