import { useState, useCallback, useRef, useEffect } from 'react';
import type { GeoEntity } from '../types/geo.js';
import { geoService } from '../services/geoService.js';

/**
 * Hook to manage geo-autocomplete search form state and orchestration.
 * Logic layer: handles state transitions and service calls.
 */
export const useGeoSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoEntity[]>([]);
  const [selected, setSelected] = useState<GeoEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use ref to store timeout ID for debouncing search calls
  const debounceTimer = useRef<number | null>(null);

  /**
   * Performs the geo search based on current query.
   */
  const performSearch = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const searchResults = await geoService.searchGeo(searchQuery);
      setResults(searchResults);
      setIsOpen(true);
    } catch {
      // In a real app, we'd handle this via UI error states
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetches countries list for initial interaction or re-selections.
   */
  const fetchCountries = useCallback(async () => {
    setIsLoading(true);
    try {
      const countriesMap = await geoService.fetchCountries();
      // Normalize countries into GeoEntity format
      const countryEntities: GeoEntity[] = Object.values(countriesMap).map(c => ({
        id: c.id,
        name: c.name,
        type: 'country',
        flag: c.flag
      }));
      setResults(countryEntities);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handles click on the input field.
   */
  const onInputClick = useCallback(() => {
    // Behavior per spec:
    // If no selection OR selected is a country -> show countries list
    // If selected is city/hotel -> show search results for current query
    if (!selected || selected.type === 'country') {
      fetchCountries();
    } else {
      performSearch(query);
    }
  }, [selected, query, fetchCountries, performSearch]);

  /**
   * Handles text input changes with debounce.
   */
  const onInputChange = useCallback((value: string) => {
    setQuery(value);
    
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Don't search for empty query (reset to country list or close)
    if (!value.trim()) {
      setResults([]);
      return;
    }

    // Set new debounce timer - 300ms is standard for search
    debounceTimer.current = window.setTimeout(() => {
      performSearch(value);
    }, 300);
  }, [performSearch]);

  /**
   * Handles selection of a dropdown item.
   */
  const onSelect = useCallback((entity: GeoEntity) => {
    setSelected(entity);
    setQuery(entity.name);
    setIsOpen(false);
  }, []);

  /**
   * Manual close (e.g. on Escape or click outside).
   */
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

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
    setIsOpen // Exported for manual control if needed
  };
};
