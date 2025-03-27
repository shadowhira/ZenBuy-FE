import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShops, getShopById, getShopProducts, createShop, updateShop, deleteShop } from '../apis/shops';
import { Shop, Product } from '../types';

export function useShops() {
  return useQuery({
    queryKey: ['shops'],
    queryFn: getShops,
  });
}

export function useShop(id: number) {
  return useQuery({
    queryKey: ['shop', id],
    queryFn: () => getShopById(id),
  });
}

export function useShopProducts(id: number, params?: {
  page?: number;
  limit?: number;
  sort?: string;
}) {
  return useQuery({
    queryKey: ['shop-products', id, params],
    queryFn: () => getShopProducts(id, params),
  });
}

export function useCreateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
}

export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, shop }: { id: number; shop: Partial<Shop> }) =>
      updateShop(id, shop),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop', id] });
    },
  });
}

export function useDeleteShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShop,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop', id] });
    },
  });
} 