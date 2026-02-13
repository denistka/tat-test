import { startSearchPrices, getSearchPrices, stopSearchPrices } from '../api/api.js';
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
  },

  /**
   * Stops an active search.
   * Ignores 404 errors as the token might already be expired/cancelled.
   */
  async stopSearch(token: string): Promise<void> {
    try {
      const response = await stopSearchPrices(token);
      // Even if not ok, we parse to ensure we handle it, but we primarily care about 404
      if (!response.ok && response.status !== 404) {
        const errorData: SearchError = await response.json();
        throw errorData;
      }
    } catch (error) {
      // Ignore 404 (token already gone) as requested in ST1
      if ((error as Response)?.status === 404) return;
      if ((error as SearchError).error && (error as SearchError).code === 404) return;
      
      // For other errors, we can log or ignore, but ST1 says handle 404 gracefully
      console.warn('stopSearch failed:', error);
    }
  }
};
