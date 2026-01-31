/**
 * Custom Hook: useRestaurantSearch
 * Handles restaurant search with debouncing and suggestions
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { restaurantsApi } from '@/shared/api/restaurants';
import type { Restaurant } from '@/shared/types';

const DEBOUNCE_DELAY = 300;

export const useRestaurantSearch = (searchQuery: string) => {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch restaurants based on search query
  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurant-search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        return [];
      }
      
      const restaurants = await restaurantsApi.getRestaurants({
        page: 1,
        limit: 5, // Limit suggestions to 5 items
      });

      // Filter restaurants by name (client-side filtering)
      return restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    },
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const suggestions: Restaurant[] = data || [];

  return {
    suggestions,
    isLoading,
    error,
    hasResults: suggestions.length > 0,
  };
};