import { apiClient } from './axios';
import type { Restaurant, MenuItem, ApiResponse } from '../types';

export const restaurantsApi = {
  // 🔹 GET ALL RESTAURANTS
  getRestaurants: async (params?: {
    location?: string;
    range?: number;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    page?: number;
    limit?: number;
  }): Promise<Restaurant[]> => {
    const response = await apiClient.get<
      ApiResponse<{ restaurants: Restaurant[] }>
    >('/api/restaurants', { params });

    return response.data.data.restaurants;
  },

  // 🔹 GET RECOMMENDED
  getRecommendedRestaurants: async (
    page: number = 1,
    limit: number = 12
  ): Promise<{ restaurants: Restaurant[]; hasMore: boolean }> => {
    const response = await apiClient.get<
      ApiResponse<{
        restaurants: Restaurant[];
        pagination?: { page: number; totalPages: number };
      }>
    >('/api/restaurants/recommended', {
      params: { page, limit },
    });

    const restaurants = response.data.data.restaurants ?? [];
    const pagination = response.data.data.pagination;

    return {
      restaurants,
      hasMore: pagination
        ? pagination.page < pagination.totalPages
        : restaurants.length === limit,
    };
  },

  // 🔹 GET DETAIL
  getRestaurantById: async (id: string): Promise<Restaurant> => {
    const response = await apiClient.get<ApiResponse<Restaurant>>(
      `/api/restaurants/${id}`
    );
    return response.data.data;
  },

  // 🔹 GET MENUS
  getRestaurantMenus: async (restaurantId: string): Promise<MenuItem[]> => {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>(
      `/api/restaurants/${restaurantId}/menus`
    );

    return response.data.data ?? [];
  },
};

