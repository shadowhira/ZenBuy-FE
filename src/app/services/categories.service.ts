import { Category } from '@/types';
import { fetchApi } from './api';

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    return fetchApi<Category[]>('/categories');
  },

  async getCategoryById(id: number): Promise<Category> {
    return fetchApi<Category>(`/categories/${id}`);
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return fetchApi<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
  },

  async updateCategory(id: number, category: Partial<Category>): Promise<Category> {
    return fetchApi<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category)
    });
  },

  async deleteCategory(id: number): Promise<void> {
    return fetchApi<void>(`/categories/${id}`, {
      method: 'DELETE'
    });
  }
}; 