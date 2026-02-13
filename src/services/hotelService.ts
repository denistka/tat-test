import { getHotels } from '../api/api.js';
import { HotelsMap } from '../types/hotel.js';

/**
 * Service for fetching hotel data from the API.
 * Follows the pure network wrapper pattern (no state, no caching).
 */
export const hotelService = {
  /**
   * Fetches hotels for a specific country.
   * @param countryID - The ID of the country to fetch hotels for.
   * @returns A promise that resolves to a map of hotels.
   */
  async fetchHotelsByCountry(countryID: string): Promise<HotelsMap> {
    const response = await getHotels(countryID);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch hotels for country ${countryID}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as HotelsMap;
  }
};
