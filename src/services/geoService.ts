import { getCountries, searchGeo } from '../api/api.js';
import { CountriesMap, GeoEntity, GeoResponse } from '../types/geo.js';

/**
 * Service to handle geo-related network requests.
 * Pure network layer: wraps API calls and returns typed data.
 */
export const geoService = {
  /**
   * Fetches all available countries.
   */
  async fetchCountries(): Promise<CountriesMap> {
    try {
      const response = await getCountries();
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },

  /**
   * Searches for geo entities (countries, cities, hotels) by query string.
   */
  async searchGeo(query: string): Promise<GeoEntity[]> {
    if (!query.trim()) return [];

    try {
      const response = await searchGeo(query);
      if (!response.ok) {
        throw new Error(`Failed to search geo: ${response.statusText}`);
      }
      const data: GeoResponse = await response.json();
      
      // Normalize object response into a typed array
      return Object.values(data);
    } catch (error) {
      console.error(`Error searching geo for query "${query}":`, error);
      throw error;
    }
  }
};
