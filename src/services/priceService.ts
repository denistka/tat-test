import {
  startSearchPrices,
  getSearchPrices,
  stopSearchPrices,
} from '../api/api.js'
import type {
  PricesMap,
  StartSearchResponse,
  SearchError,
  GetSearchPricesResponse,
} from '../types/search.js'

export const priceService = {
  async startSearch(countryID: string): Promise<StartSearchResponse> {
    try {
      const response = await startSearchPrices(countryID)

      if (!response.ok) {
        const errorData: SearchError = await response.json()
        throw errorData
      }

      return await response.json()
    } catch (error) {
      if ((error as SearchError).error) throw error
      throw new Error('Failed to start price search')
    }
  },

  async getResults(token: string): Promise<PricesMap> {
    try {
      const response = await getSearchPrices(token)

      if (!response.ok) {
        const errorData: SearchError = await response.json()
        throw errorData
      }

      const data: GetSearchPricesResponse = await response.json()
      return data.prices
    } catch (error) {
      if ((error as SearchError).error) throw error
      throw new Error('Failed to fetch search prices')
    }
  },

  async stopSearch(token: string): Promise<void> {
    try {
      const response = await stopSearchPrices(token)
      if (!response.ok && response.status !== 404) {
        const errorData: SearchError = await response.json()
        throw errorData
      }
    } catch (error) {
      if ((error as Response)?.status === 404) return
      if ((error as SearchError).error && (error as SearchError).code === 404)
        return

      console.warn('stopSearch failed:', error)
    }
  },
}
