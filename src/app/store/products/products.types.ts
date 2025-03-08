export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  subcategory?: string
  subsubcategory?: string
  rating: number
  reviews: number
  shopId: string
  shopName: string
}

export interface ProductsState {
  products: Product[]
  featuredProducts: Product[]
  currentProduct: Product | null
  isLoading: boolean
  error: string | null
}

