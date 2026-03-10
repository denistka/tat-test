import type { PricesMap } from '../types/search.js'

const resultsCache = new Map<string, PricesMap>()

export const searchStore = {
  getCache(countryID: string): PricesMap | undefined {
    return resultsCache.get(countryID)
  },
  setCache(countryID: string, prices: PricesMap): void {
    resultsCache.set(countryID, prices)
  },
  clearCache(): void {
    resultsCache.clear()
  },
}
