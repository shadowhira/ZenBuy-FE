export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

export interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
}

