import { CartItem, CartResponse, Cart } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.escuelajs.co/api/v1';

export async function getCart(): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/cart`);
  if (!response.ok) throw new Error('Failed to fetch cart');
  return response.json();
}

export async function updateCart(items: CartItem[]): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) throw new Error('Failed to update cart');
  return response.json();
}

// Helper functions
export async function addToCart(item: CartItem): Promise<CartResponse> {
  const cart = await getCart();
  const existingItem = cart.items.find(i => i.productId === item.productId);
  
  if (existingItem) {
    const updatedItems = cart.items.map(i =>
      i.productId === item.productId
        ? { ...i, quantity: i.quantity + item.quantity }
        : i
    );
    return updateCart(updatedItems);
  }
  
  return updateCart([...cart.items, item]);
}

export async function updateCartItem(itemId: string, quantity: number): Promise<CartResponse> {
  const cart = await getCart();
  const updatedItems = cart.items.map(item =>
    item.id === itemId
      ? { ...item, quantity }
      : item
  );
  return updateCart(updatedItems);
}

export async function removeFromCart(itemId: string): Promise<CartResponse> {
  const cart = await getCart();
  const updatedItems = cart.items.filter(item => item.id !== itemId);
  return updateCart(updatedItems);
}

export async function clearCart(): Promise<CartResponse> {
  return updateCart([]);
} 