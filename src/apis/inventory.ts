import { InventoryItem } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.escuelajs.co/api/v1';

export async function getInventory(): Promise<InventoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/inventory`);
  if (!response.ok) throw new Error('Failed to fetch inventory');
  return response.json();
}

export async function addInventoryItem(item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">): Promise<InventoryItem> {
  const response = await fetch(`${API_BASE_URL}/inventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error('Failed to add inventory item');
  return response.json();
}

export async function updateInventoryItem(id: string, updates: Partial<Omit<InventoryItem, "id" | "createdAt" | "updatedAt">>): Promise<InventoryItem> {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update inventory item');
  return response.json();
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete inventory item');
} 