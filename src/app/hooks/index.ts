// Auth hooks
export { useLogin, useRegister, useLogout, useProfile, useUpdateProfile } from "./use-auth"
export { useAuthCheck } from "./use-auth-check"

// Products hooks
export {
  useProducts,
  useInfiniteProducts,
  useProductById,
  useFeaturedProducts,
  useSearchProducts,
} from "./use-products"

// Cart hooks
export {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "./use-cart"

// Orders hooks
export {
  useOrders,
  useOrderById,
  useCreateOrder,
  useUpdateOrderStatus,
} from "./use-orders"

// Seller Inventory hooks
export {
  useInventory,
  useInventoryItem,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
} from "./use-inventory"

// Seller Analytics hooks
export { useAnalytics } from "./use-analytics"

// Seller Shop hooks
export { useShopDetails, useUpdateShopDetails } from "./use-shop"

// Product Variants hooks
export {
  useProductVariants,
  useProductVariant,
  useCreateProductVariant,
  useUpdateProductVariant,
  useDeleteProductVariant,
} from "./use-product-variants"

