import { getHotels } from '../api/api.js'
import type { HotelsMap } from '../types/hotel.js'

export const hotelService = {
  async fetchHotelsByCountry(countryID: string): Promise<HotelsMap> {
    const response = await getHotels(countryID)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch hotels for country ${countryID}: ${response.statusText}`,
      )
    }

    const data = (await response.json()) as HotelsMap
    return data
  },
}
