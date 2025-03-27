import { CartItem } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.escuelajs.co/api/v1';

export async function getCart(): Promise<CartItem[]> {
  const response = await fetch(`${API_BASE_URL}/cart`);
  if (!response.ok) throw new Error('Failed to fetch cart');
  return response.json();
}

export async function addToCart(item: CartItem): Promise<CartItem[]> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error('Failed to add item to cart');
  return response.json();
}

export async function updateCartItem(item: CartItem): Promise<CartItem[]> {
  const response = await fetch(`${API_BASE_URL}/cart/${item.productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error('Failed to update cart item');
  return response.json();
}

export async function removeFromCart(productId: number): Promise<CartItem[]> {
  const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove item from cart');
  return response.json();
}

export async function clearCart(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to clear cart');
} 