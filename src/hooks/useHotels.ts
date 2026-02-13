import { useState, useRef, useCallback } from 'react';
import { hotelService } from '../services/hotelService';
import type { HotelsMap } from '../types/hotel';

/**
 * Custom hook to fetch and cache hotels per country.
 * Uses a useRef for caching to avoid redundant network requests
 * while keeping the cache outside of the render state.
 */
export const useHotels = () => {
  const [hotels, setHotels] = useState<HotelsMap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache stored in a ref to persist across renders without triggering them
  const cacheRef = useRef<Record<string, HotelsMap>>({});

  /**
   * Fetches hotels for a specific country ID.
   * Checks the local cacheRef first before making a network request.
   */
  const fetchHotels = useCallback(async (countryID: string) => {
    // 1. Check cache first
    if (cacheRef.current[countryID]) {
      setHotels(cacheRef.current[countryID]);
      setError(null);
      return;
    }

    // 2. Fetch from service if not in cache
    setIsLoading(true);
    setError(null);

    try {
      const data = await hotelService.fetchHotelsByCountry(countryID);
      
      // Store in cache
      cacheRef.current[countryID] = data;
      
      // Update state for rendering
      setHotels(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      setHotels(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    hotels,
    isLoading,
    error,
    fetchHotels,
  };
};
