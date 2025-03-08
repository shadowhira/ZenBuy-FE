export interface ShopDetails {
  id: string
  name: string
  description: string
  bannerImage: string
  avatarImage: string
  featuredProducts: string[]
  followers: number
  rating: number
}

export interface ShopState {
  details: ShopDetails | null
  isLoading: boolean
  error: string | null
}

