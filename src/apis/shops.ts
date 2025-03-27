import { Shop, Product } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.escuelajs.co/api/v1';

export async function getShops(): Promise<Shop[]> {
  const response = await fetch(`${API_BASE_URL}/shops`);
  if (!response.ok) throw new Error('Failed to fetch shops');
  return response.json();
}

export async function getShopById(id: number): Promise<Shop> {
  const response = await fetch(`${API_BASE_URL}/shops/${id}`);
  if (!response.ok) throw new Error('Failed to fetch shop');
  return response.json();
}

export async function getShopProducts(id: number, params?: {
  page?: number;
  limit?: number;
  sort?: string;
}): Promise<{ products: Product[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sort) queryParams.append('sort', params.sort);

  const response = await fetch(`${API_BASE_URL}/shops/${id}/products?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch shop products');
  return response.json();
}

export async function createShop(shop: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shop> {
  const response = await fetch(`${API_BASE_URL}/shops`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shop),
  });
  if (!response.ok) throw new Error('Failed to create shop');
  return response.json();
}

export async function updateShop(id: number, shop: Partial<Shop>): Promise<Shop> {
  const response = await fetch(`${API_BASE_URL}/shops/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shop),
  });
  if (!response.ok) throw new Error('Failed to update shop');
  return response.json();
}

export async function deleteShop(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/shops/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete shop');
} 