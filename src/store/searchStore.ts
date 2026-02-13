import type { PricesMap, SearchStatus } from '../types/search.js';

export interface SearchState {
  prices: PricesMap | null;
  status: SearchStatus;
  error: string | null;
  countryID: string | null;
}

/**
 * Initial state for the search.
 */
export const initialSearchState: SearchState = {
  prices: null,
  status: 'idle',
  error: null,
  countryID: null,
};

/**
 * Simple module-level cache for search results to avoid re-fetching
 * when navigating back or re-searching the same country within a session.
 */
const resultsCache = new Map<string, PricesMap>();

export const searchStore = {
  getCache(countryID: string): PricesMap | undefined {
    return resultsCache.get(countryID);
  },
  setCache(countryID: string, prices: PricesMap): void {
    resultsCache.set(countryID, prices);
  },
  clearCache(): void {
    resultsCache.clear();
  }
};
