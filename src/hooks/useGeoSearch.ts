import { useState, useCallback, useRef, useEffect } from 'react'
import type { GeoEntity } from '../types/geo.js'
import { geoService } from '../services/geoService.js'

export const useGeoSearch = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoEntity[]>([])
  const [selected, setSelected] = useState<GeoEntity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const debounceTimer = useRef<number | null>(null)

  const performSearch = useCallback(async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const searchResults = await geoService.searchGeo(searchQuery)
      setResults(searchResults)
      setIsOpen(searchResults.length > 0)
      setActiveIndex(searchResults.length > 0 ? 0 : -1)
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchCountries = useCallback(async () => {
    setIsLoading(true)
    try {
      const countriesMap = await geoService.fetchCountries()
      const countryEntities: GeoEntity[] = Object.values(countriesMap).map(
        c => ({
          id: c.id,
          name: c.name,
          type: 'country',
          flag: c.flag,
        }),
      )
      setResults(countryEntities)
      setIsOpen(true)
      setActiveIndex(0)
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const onInputClick = useCallback(() => {
    if (!selected || selected.type === 'country') {
      fetchCountries()
    } else {
      performSearch(query)
    }
  }, [selected, query, fetchCountries, performSearch])

  const onInputChange = useCallback((value: string) => {
    setQuery(value)

    setSelected(null)
    setActiveIndex(-1)

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (!value.trim()) {
      setResults([])
      return
    }

    debounceTimer.current = window.setTimeout(() => {
      performSearch(value)
    }, 300)
  }, [performSearch])

  const onSelect = useCallback((entity: GeoEntity) => {
    setSelected(entity)
    setQuery(entity.name)
    setIsOpen(false)
  }, [])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setActiveIndex(-1)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  return {
    query,
    results,
    selected,
    isOpen,
    isLoading,
    onInputClick,
    onInputChange,
    onSelect,
    closeDropdown,
    setIsOpen,
    setSelected,
    activeIndex,
    setActiveIndex,
  }
}
