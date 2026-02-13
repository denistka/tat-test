import { startSearchPrices, getSearchPrices } from '../api/api.js';
import type { PricesMap, StartSearchResponse, SearchError, GetSearchPricesResponse } from '../types/search.js';

/**
 * Service to handle price-related network requests.
 * Pure network layer: wraps API calls and handles raw responses.
 */
export const priceService = {
  /**
   * Starts a new price search for a given country.
   */
  async startSearch(countryID: string): Promise<StartSearchResponse> {
    try {
      const response = await startSearchPrices(countryID);
      
      if (!response.ok) {
        const errorData: SearchError = await response.json();
        throw errorData;
      }
      
      return await response.json();
    } catch (error) {
      if ((error as SearchError).error) throw error;
      throw new Error('Failed to start price search');
    }
  },

  /**
   * Fetches results for an active search token.
   * Handles 425 (Too Early) by throwing the specific SearchError with waitUntil.
   */
  async getResults(token: string): Promise<PricesMap> {
    try {
      const response = await getSearchPrices(token);
      
      if (!response.ok) {
        const errorData: SearchError = await response.json();
        // Specifically throw SearchError so hook can handle 425 'waitUntil'
        throw errorData;
      }
      
      const data: GetSearchPricesResponse = await response.json();
      return data.prices;
    } catch (error) {
      // Re-throw if it's already a shaped SearchError (like 425 or 404)
      if ((error as SearchError).error) throw error;
      throw new Error('Failed to fetch search prices');
    }
  }
};
