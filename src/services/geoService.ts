import { getCountries, searchGeo } from '../api/api.js'
import type { CountriesMap, GeoEntity, GeoResponse } from '../types/geo.js'

export const geoService = {
  async fetchCountries(): Promise<CountriesMap> {
    try {
      const response = await getCountries()
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching countries:', error)
      throw error
    }
  },

  async searchGeo(query: string): Promise<GeoEntity[]> {
    if (!query.trim()) return []

    try {
      const response = await searchGeo(query)
      if (!response.ok) {
        throw new Error(`Failed to search geo: ${response.statusText}`)
      }
      const data: GeoResponse = await response.json()

      return Object.values(data)
    } catch (error) {
      console.error(`Error searching geo for query "${query}":`, error)
      throw error
    }
  },
}
