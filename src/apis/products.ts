import { Product, ProductVariant, ProductsResponse, ProductQueryParams } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.escuelajs.co/api/v1';

export async function getProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.query) queryParams.append('query', params.query);
  if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
  if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params?.sort) queryParams.append('sort', params.sort);

  const response = await fetch(`/api/products?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'GET',
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Product not found')
      }
      throw new Error('Failed to fetch product')
    }

    const data = await response.json()
    
    // Kiểm tra dữ liệu trả về
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid product data')
    }

    // Đảm bảo các trường bắt buộc tồn tại
    const product: Product = {
      id: data.id || 0,
      title: data.title || data.name || '',
      description: data.description || '',
      price: data.price || 0,
      stock: data.stock || 0,
      images: data.images || [],
      category: data.category || { id: 0, name: 'Uncategorized' },
      shop: data.shop || { id: 0, name: 'Unknown Shop' },
      rating: data.rating || 0,
      reviews: data.reviews || [],
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    }

    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete product');
}

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload image');
  const data = await response.json();
  return data.url;
} 