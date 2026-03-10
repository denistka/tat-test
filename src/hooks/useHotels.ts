import { useState, useRef, useCallback } from 'react'
import { hotelService } from '../services/hotelService'
import type { HotelsMap } from '../types/hotel'

export const useHotels = () => {
  const [hotels, setHotels] = useState<HotelsMap | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cacheRef = useRef<Record<string, HotelsMap>>({})

  const fetchHotels = useCallback(async (countryID: string) => {
    if (cacheRef.current[countryID]) {
      setHotels(cacheRef.current[countryID])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await hotelService.fetchHotelsByCountry(countryID)

      cacheRef.current[countryID] = data
      setHotels(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred'
      setError(message)
      setHotels(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    hotels,
    isLoading,
    error,
    fetchHotels,
  }
}
