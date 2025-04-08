export interface ProductQueryParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface Product {
  _id: string;
  id?: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand?: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  shop?: {
    _id: string;
    name: string;
    logo?: string;
    followers?: number;
    rating?: number;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
}
