import type { Product } from "@/store/products/products.types"

export function generateMockProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `Product ${i + 1}`,
    description: `This is a detailed description for Product ${i + 1}. It includes information about the product features, specifications, and usage.`,
    price: Math.floor(Math.random() * 100) + 10,
    images: Array.from({ length: 4 }, (_, j) => `/product${(j % 8) + 1}.jpg`),
    category: ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"][Math.floor(Math.random() * 5)],
    subcategory: i % 2 === 0 ? "Smartphones" : undefined,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 100),
    shopId: "shop-1",
    shopName: "Tech Store",
  }))
}

