import { fetchApi } from "./api"
import type { ShopDetails } from "@/store/seller/shop/shop.types"

export const shopService = {
  getShopDetails: () => fetchApi<ShopDetails>("/seller/shop"),

  updateShopDetails: (data: Partial<Omit<ShopDetails, "id">>) =>
    fetchApi<ShopDetails>("/seller/shop", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

